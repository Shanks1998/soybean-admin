/**
 * Admin Seed Management API
 * 种子管理相关 API
 */

import { adminRequest } from '../request/admin';

/**
 * Get seed list with pagination
 * 获取种子列表（分页）
 * @param params - Pagination params
 */
export function fetchSeedList(params: Api.Admin.Seed.SeedListParams) {
  return adminRequest<Api.Admin.Seed.SeedListResponse>({
    url: '/seeds',
    method: 'get',
    params
  });
}

/**
 * Get seed detail by ID
 * 获取种子详情
 * @param id - Seed ID
 */
export function fetchSeedDetail(id: number) {
  return adminRequest<Api.Admin.Seed.SeedConfig>({
    url: `/seeds/${id}`,
    method: 'get'
  });
}

/**
 * Create seed
 * 创建种子
 * @param data - Create seed request
 */
export function createSeed(data: Api.Admin.Seed.CreateSeedRequest) {
  return adminRequest<Api.Admin.Seed.SeedConfig>({
    url: '/seeds',
    method: 'post',
    data
  });
}

/**
 * Update seed
 * 更新种子
 * @param id - Seed ID
 * @param data - Update seed request
 */
export function updateSeed(id: number, data: Api.Admin.Seed.UpdateSeedRequest) {
  return adminRequest({
    url: `/seeds/${id}`,
    method: 'put',
    data
  });
}

/**
 * Delete seed
 * 删除种子
 * @param id - Seed ID
 */
export function deleteSeed(id: number) {
  return adminRequest({
    url: `/seeds/${id}`,
    method: 'delete'
  });
}

/**
 * Update seed status
 * 更新种子状�? * @param id - Seed ID
 * @param data - Update status request
 */
export function updateSeedStatus(id: number, data: Api.Admin.Seed.UpdateSeedStatusRequest) {
  return adminRequest({
    url: `/seeds/${id}/status`,
    method: 'put',
    data
  });
}
