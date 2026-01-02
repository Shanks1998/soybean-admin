import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { ADMIN_PERMISSIONS } from '@/constants/business';
import { fetchAdminLogin, fetchAdminProfile, fetchGetUserInfo, fetchLogin } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  /** User type: admin or regular */
  const userType = ref<Api.Auth.UserType | null>(null);

  /** Regular user info */
  const userInfo: Api.Auth.UserInfo = reactive({
    userId: '',
    userName: '',
    roles: [],
    buttons: []
  });

  /** Admin user info */
  const adminInfo: Api.Auth.AdminInfo = reactive({
    id: 0,
    username: '',
    role: 'operator',
    status: 0,
    created_at: '',
    updated_at: ''
  });

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login - supports both admin and regular users */
  const isLogin = computed(() => {
    if (userType.value === 'admin') {
      return Boolean(adminInfo && adminInfo.id);
    }
    return Boolean(token.value);
  });

  /** Admin role */
  const role = computed(() => {
    if (userType.value === 'admin') {
      return adminInfo?.role || 'operator';
    }
    return userInfo.roles[0] || '';
  });

  /** Is super admin */
  const isSuperAdmin = computed(() => adminInfo?.role === 'super_admin');

  /** Is admin */
  const isAdmin = computed(() => adminInfo?.role === 'admin');

  /** Is operator */
  const isOperator = computed(() => adminInfo?.role === 'operator');

  /** Reset auth store */
  async function resetStore() {
    // Record user ID only for regular users
    if (userType.value === 'regular') {
      recordUserId();
    }

    clearAuthStorage();

    // Reset admin info
    if (adminInfo) {
      Object.assign(adminInfo, {
        id: 0,
        username: '',
        role: 'operator',
        status: 0,
        created_at: '',
        updated_at: ''
      });
    }

    // Reset user type
    userType.value = null;

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /** Record the user ID of the previous login session Used to compare with the current user ID on next login */
  function recordUserId() {
    if (!userInfo.userId) {
      return;
    }

    // Store current user ID locally for next login comparison
    localStg.set('lastLoginUserId', userInfo.userId);
  }

  /**
   * Check if current login user is different from previous login user If different, clear all tabs
   *
   * @returns {boolean} Whether to clear all tabs
   */
  function checkTabClear(): boolean {
    if (!userInfo.userId) {
      return false;
    }

    const lastLoginUserId = localStg.get('lastLoginUserId');

    // Clear all tabs if current user is different from previous user
    if (!lastLoginUserId || lastLoginUserId !== userInfo.userId) {
      localStg.remove('globalTabs');
      tabStore.clearTabs();

      localStg.remove('lastLoginUserId');
      return true;
    }

    localStg.remove('lastLoginUserId');
    return false;
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();

    const { data: loginToken, error } = await fetchLogin(userName, password);

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        // Check if the tab needs to be cleared
        const isClear = checkTabClear();
        let needRedirect = redirect;

        if (isClear) {
          // If the tab needs to be cleared,it means we don't need to redirect.
          needRedirect = false;
        }
        await redirectFromLogin(needRedirect);

        window.$notification?.success({
          title: $t('page.login.common.loginSuccess'),
          content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
          duration: 4500
        });
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.token);
    localStg.set('refreshToken', loginToken.refreshToken);

    // 2. get user info
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.token;

      return true;
    }

    return false;
  }

  async function getUserInfo() {
    const { data: info, error } = await fetchGetUserInfo();

    if (!error) {
      // update store
      Object.assign(userInfo, info);

      return true;
    }

    return false;
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  /**
   * Admin login
   *
   * @param username Admin username
   * @param password Admin password
   * @param [redirect=true] Whether to redirect after login
   */
  async function adminLogin(username: string, password: string, redirect = true) {
    startLoading();

    try {
      const { data, error } = await fetchAdminLogin(username, password);

      if (!error && data) {
        const pass = await getAdminProfile();

        if (pass) {
          userType.value = 'admin';

          if (redirect) {
            await redirectFromLogin();
          }

          // Transform has unwrapped the response, data is now the direct login response
          const loginData = data as Api.Admin.Auth.LoginResponse;
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName: loginData.username }),
            duration: 4500
          });

          return true;
        }
      }

      return false;
    } finally {
      endLoading();
    }
  }

  /**
   * Get admin profile
   */
  async function getAdminProfile() {
    const { data, error } = await fetchAdminProfile();

    // transformBackendResponse has already unwrapped the response
    // data is now directly the admin info object, not wrapped in { code, message, data }
    if (!error && data && adminInfo) {
      Object.assign(adminInfo, data);
      return true;
    }

    return false;
  }

  /**
   * Check if admin has permission
   *
   * @param module Module name
   * @param action Action name
   */
  function hasPermission(module: keyof typeof ADMIN_PERMISSIONS, action: string): boolean {
    if (userType.value !== 'admin' || !role.value) return false;

    const permissions = ADMIN_PERMISSIONS[module];
    if (!permissions) return false;

    const allowedRoles = permissions[action as keyof typeof permissions];
    if (!allowedRoles) return false;

    return (allowedRoles as readonly string[]).includes(role.value);
  }

  /**
   * Init admin info (check login status on app init)
   */
  async function initAdminInfo() {
    const pass = await getAdminProfile();

    if (pass) {
      userType.value = 'admin';
    } else {
      await resetStore();
    }
  }

  return {
    // Existing exports (regular user)
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo,

    // New exports (admin user)
    userType,
    adminInfo,
    role,
    isSuperAdmin,
    isAdmin,
    isOperator,
    adminLogin,
    getAdminProfile,
    hasPermission,
    initAdminInfo
  };
});
