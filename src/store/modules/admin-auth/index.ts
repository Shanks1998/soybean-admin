/**
 * Admin Authentication Store
 * 管理员认证状态管理
 */

import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { ADMIN_PERMISSIONS } from '@/constants/business';
import { fetchAdminLogin, fetchAdminLogout, fetchAdminProfile } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

export const useAdminAuthStore = defineStore('admin-auth', () => {
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  /** Admin info */
  const adminInfo: Api.Admin.Auth.AdminInfo | null = reactive({
    id: 0,
    username: '',
    role: 'operator',
    status: 0 as 0 | 1,
    created_at: '',
    updated_at: ''
  });

  /** Is login */
  const isLogin = computed(() => Boolean(adminInfo && adminInfo.id));

  /** Admin role */
  const role = computed(() => adminInfo?.role || 'operator');

  /** Admin username */
  const username = computed(() => adminInfo?.username || '');

  /** Is super admin */
  const isSuperAdmin = computed(() => role.value === 'super_admin');

  /** Is admin */
  const isAdmin = computed(() => role.value === 'admin');

  /** Is operator */
  const isOperator = computed(() => role.value === 'operator');

  /**
   * Check if user has permission
   * @param module - Module name
   * @param action - Action name
   */
  function hasPermission(module: keyof typeof ADMIN_PERMISSIONS, action: string): boolean {
    if (!role.value) return false;

    const permissions = ADMIN_PERMISSIONS[module];
    if (!permissions) return false;

    const allowedRoles = permissions[action as keyof typeof permissions];
    if (!allowedRoles) return false;

    return (allowedRoles as readonly string[]).includes(role.value);
  }

  /**
   * Reset admin auth store
   */
  async function resetStore() {
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

    await toLogin();
  }

  /**
   * Admin login
   * @param usernameInput - Username
   * @param password - Password
   * @param redirect - Whether to redirect after login
   */
  async function login(usernameInput: string, password: string, redirect = true) {
    startLoading();

    try {
      const { data, error } = await fetchAdminLogin(usernameInput, password);

      if (!error && data) {
        // Get admin profile
        const pass = await getAdminProfile();

        if (pass) {
          if (redirect) {
            await redirectFromLogin();
          }

          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName: data.username }),
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
   * Admin logout
   */
  async function logout() {
    try {
      await fetchAdminLogout();
      // Ignore logout error
    } finally {
      await resetStore();
    }
  }

  /**
   * Get admin profile
   */
  async function getAdminProfile() {
    const { data, error } = await fetchAdminProfile();

    if (!error && data && adminInfo) {
      Object.assign(adminInfo, data);
      return true;
    }

    return false;
  }

  /**
   * Init admin info (check login status on app init)
   */
  async function initAdminInfo() {
    const pass = await getAdminProfile();

    if (!pass) {
      await resetStore();
    }
  }

  return {
    adminInfo,
    isLogin,
    role,
    username,
    isSuperAdmin,
    isAdmin,
    isOperator,
    loginLoading,
    hasPermission,
    resetStore,
    login,
    logout,
    getAdminProfile,
    initAdminInfo
  };
});
