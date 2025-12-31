/**
 * Admin User Management API
 * 用户管理相关 API
 */

import { adminRequest } from '../request/admin';

/**
 * Get user list with pagination
 * 获取用户列表（分页）
 * @param params - Pagination params
 */
export function fetchUserList(params: Api.Admin.User.UserListParams) {
  return adminRequest<Api.Admin.User.UserListResponse>({
    url: '/users',
    method: 'get',
    params
  });
}

/**
 * Get user detail by ID
 * 获取用户详情
 * @param id - User ID
 */
export function fetchUserDetail(id: number) {
  return adminRequest<Api.Admin.User.UserDetail>({
    url: `/users/${id}`,
    method: 'get'
  });
}

/**
 * Delete user
 * 删除用户
 * @param id - User ID
 */
export function deleteUser(id: number) {
  return adminRequest({
    url: `/users/${id}`,
    method: 'delete'
  });
}

/**
 * Update user status
 * 更新用户状�? * @param id - User ID
 * @param data - Status request
 */
export function updateUserStatus(id: number, data: Api.Admin.User.UpdateStatusRequest) {
  return adminRequest({
    url: `/users/${id}/status`,
    method: 'put',
    data
  });
}

/**
 * Adjust user fertilizer amount
 * 调整用户肥料数量
 * @param id - User ID
 * @param data - Adjust fertilizer request
 */
export function adjustUserFertilizer(id: number, data: Api.Admin.User.AdjustFertilizerRequest) {
  return adminRequest({
    url: `/users/${id}/fertilizer/adjust`,
    method: 'post',
    data
  });
}

/**
 * Update user max daily fertilize count
 * 更新用户每天最大施肥次�? * @param id - User ID
 * @param data - Update max fertilize count request
 */
export function updateUserMaxDailyFertilizeCount(id: number, data: Api.Admin.User.UpdateMaxFertilizeCountRequest) {
  return adminRequest({
    url: `/users/${id}/max-daily-fertilize-count`,
    method: 'put',
    data
  });
}
