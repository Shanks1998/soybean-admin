/**
 * Admin Harvest Record Management API
 * 收获记录管理相关 API
 */

import { adminRequest } from '../request/admin';

/**
 * Get harvest record list with pagination
 * 获取收获记录列表（分页）
 * @param params - List params with pagination and status filter
 */
export function fetchHarvestList(params: Api.Admin.Harvest.HarvestListParams) {
  return adminRequest<Api.Admin.Harvest.HarvestListResponse>({
    url: '/harvest',
    method: 'get',
    params
  });
}

/**
 * Get harvest record detail by ID
 * 获取收获记录详情
 * @param id - Record ID
 */
export function fetchHarvestDetail(id: number) {
  return adminRequest<Api.Admin.Harvest.HarvestRecord>({
    url: `/harvest/${id}`,
    method: 'get'
  });
}

/**
 * Update harvest record status
 * 更新收获记录状态
 * @param id - Record ID
 * @param data - Update status request
 */
export function updateHarvestStatus(id: number, data: Api.Admin.Harvest.UpdateStatusRequest) {
  return adminRequest<Api.Admin.Harvest.HarvestRecord>({
    url: `/harvest/${id}/status`,
    method: 'put',
    data
  });
}

/**
 * Update tracking number (will auto set status to 'shipped')
 * 更新快递单号（自动设置状态为已发货）
 * @param id - Record ID
 * @param data - Update tracking number request
 */
export function updateTrackingNo(id: number, data: Api.Admin.Harvest.UpdateTrackingNoRequest) {
  return adminRequest<Api.Admin.Harvest.HarvestRecord>({
    url: `/harvest/${id}/tracking-no`,
    method: 'put',
    data
  });
}
