/**
 * Admin Order Repair API
 * 订单补单相关 API
 */

import { adminRequest } from '../request/admin';

/**
 * Repair order payment
 * 补单支付（手动触发订单支付成功逻辑）
 * @param data - Order ID
 */
export function repairOrderPay(data: Api.Admin.Order.RepairPayRequest) {
  return adminRequest({
    url: '/admin/api/orders/repair/pay',
    method: 'post',
    data
  });
}

/**
 * Repair order cancel
 * 补单取消（手动触发订单取消退款逻辑）
 * @param data - Order ID
 */
export function repairOrderCancel(data: Api.Admin.Order.RepairCancelRequest) {
  return adminRequest({
    url: '/admin/api/orders/repair/cancel',
    method: 'post',
    data
  });
}
