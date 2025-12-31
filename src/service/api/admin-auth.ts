/**
 * Admin Authentication API
 * 管理员认证相关 API
 */

import { adminRequest } from '../request/admin';

/**
 * Admin login
 * 管理员登录
 * @param username - Username
 * @param password - Password
 */
export function fetchAdminLogin(username: string, password: string) {
  return adminRequest<Api.Admin.Auth.LoginResponse>({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  });
}

/**
 * Admin logout
 * 管理员登出
 */
export function fetchAdminLogout() {
  return adminRequest({
    url: '/logout',
    method: 'post'
  });
}

/**
 * Get admin profile
 * 获取管理员信息
 */
export function fetchAdminProfile() {
  return adminRequest<Api.Admin.Auth.AdminInfo>({
    url: '/profile'
  });
}
