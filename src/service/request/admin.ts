/**
 * Admin API Request Instance
 * 管理端 API 请求实例（使用 Cookie 认证）
 */

import { createFlatRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';

// Admin API base URL
// 开发环境使用/admin/api触发Vite代理，生产环境使用完整URL
const adminBaseURL = isHttpProxy
  ? '/admin/api'
  : import.meta.env.VITE_ADMIN_API_URL ||
    'http://test-1g11d9bff9ebb505-1387006922.ap-shanghai.app.tcloudbase.com/admin/api';

console.log('🔧 [Admin Request] Mode:', isHttpProxy ? 'Proxy' : 'Direct');
console.log('🔧 [Admin Request] Using base URL:', adminBaseURL);

export const adminRequest = createFlatRequest(
  {
    baseURL: adminBaseURL,
    withCredentials: true, // Important: Enable cookie credentials
    timeout: 30000
  },
  {
    async onRequest(config) {
      // Cookie authentication: cookies will be sent automatically
      return config;
    },
    isBackendSuccess(response) {
      // Admin API success code is 0
      const data = response.data as App.Service.AdminResponse;
      return data.code === 0;
    },
    async onBackendFail(response) {
      const authStore = useAuthStore();
      const data = response.data as App.Service.AdminResponse;
      const { code, message } = data;

      // 401 Unauthorized - redirect to login
      if (code === 401) {
        await authStore.resetStore();
        return null;
      }

      // 403 Forbidden - show error and logout
      if (code === 403) {
        window.$dialog?.error({
          title: $t('common.error'),
          content: message || $t('common.tip'),
          positiveText: $t('common.confirm'),
          onPositiveClick: async () => {
            await authStore.resetStore();
          }
        });
        return null;
      }

      // Other errors - show message
      window.$message?.error(message || $t('common.error'));
      return null;
    },
    onError(error) {
      // Network or other errors
      window.$message?.error(error.message || $t('common.error'));
    }
  }
);
