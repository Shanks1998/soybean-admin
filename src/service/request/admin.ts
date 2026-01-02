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
    /**
     * Transform backend response data
     * 自动解包后端响应的嵌套 data 结构
     *
     * 后端返回: { code: 0, message: "success", data: {...} }
     * 转换后返回: {...} (data.data 的内容)
     */
    transformBackendResponse: async response => {
      const adminResp = response.data as App.Service.AdminResponse;

      console.log('🔄 [Transform] 解包响应数据');
      console.log('🔹 原始 response.data:', adminResp);
      console.log('🔹 提取 data.data:', adminResp.data);

      // 返回嵌套的 data 字段
      return adminResp.data;
    },
    async onRequest(config) {
      // Cookie authentication: cookies will be sent automatically
      console.log('🚀 [Admin Request] ===== 发起请求 =====');
      console.log('🔹 URL:', config.url);
      console.log('🔹 Method:', config.method?.toUpperCase());
      console.log('🔹 BaseURL:', config.baseURL);
      console.log('🔹 Complete URL:', `${config.baseURL}${config.url}`);
      console.log('🔹 Params:', config.params);
      console.log('🔹 Data:', config.data);
      console.log('🔹 Headers:', {
        'Content-Type': config.headers?.['Content-Type'],
        'X-Request-ID': config.headers?.['X-Request-ID'],
        Cookie: config.withCredentials ? '自动发送 (withCredentials: true)' : '无'
      });
      console.log('🔹 With Credentials:', config.withCredentials);
      return config;
    },
    isBackendSuccess(response) {
      // Admin API success code is 0
      const data = response.data as App.Service.AdminResponse;
      const isSuccess = data.code === 0;

      console.log('✅ [Admin Response] ===== 收到响应 =====');
      console.log('🔹 URL:', response.config.url);
      console.log('🔹 HTTP Status:', response.status, response.statusText);
      console.log('🔹 Response Headers:', response.headers);
      console.log('🔹 Response Data (完整):', JSON.stringify(response.data, null, 2));
      console.log('🔹 业务状态码 (code):', data.code);
      console.log('🔹 业务消息 (message):', data.message);
      console.log('🔹 实际数据 (data):', data.data);
      console.log('🔹 业务逻辑成功?', isSuccess ? '✅ 是' : '❌ 否');

      return isSuccess;
    },
    async onBackendFail(response) {
      const authStore = useAuthStore();
      const data = response.data as App.Service.AdminResponse;
      const { code, message } = data;

      console.error('❌ [Admin Response] 业务逻辑失败');
      console.error('🔹 错误码:', code);
      console.error('🔹 错误消息:', message);
      console.error('🔹 完整响应:', response.data);

      // 401 Unauthorized - redirect to login
      if (code === 401) {
        console.warn('⚠️ [Auth] 401 未授权，重置登录状态');
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
      console.error('💥 [Admin Request] 网络或系统错误');
      console.error('🔹 错误类型:', error.name);
      console.error('🔹 错误消息:', error.message);
      console.error('🔹 错误对象:', error);
      if (error.response) {
        console.error('🔹 响应状态:', error.response.status);
        console.error('🔹 响应数据:', error.response.data);
      }
      window.$message?.error(error.message || $t('common.error'));
    }
  }
);
