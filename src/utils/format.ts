/**
 * Format utility functions
 * 格式化工具函数
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);

/**
 * Format date time to 'YYYY-MM-DD HH:mm:ss'
 * @param dateStr - Date string
 * @param locale - Locale, default is 'zh-cn'
 */
export function formatDateTime(dateStr: string, locale = 'zh-cn'): string {
  if (!dateStr) return '-';
  dayjs.locale(locale);
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Format date to 'YYYY-MM-DD'
 * @param dateStr - Date string
 * @param locale - Locale, default is 'zh-cn'
 */
export function formatDate(dateStr: string, locale = 'zh-cn'): string {
  if (!dateStr) return '-';
  dayjs.locale(locale);
  return dayjs(dateStr).format('YYYY-MM-DD');
}

/**
 * Format relative time
 * @param dateStr - Date string
 * @param locale - Locale, default is 'zh-cn'
 */
export function formatRelativeTime(dateStr: string, locale = 'zh-cn'): string {
  if (!dateStr) return '-';
  dayjs.locale(locale);
  return dayjs(dateStr).fromNow();
}

/**
 * Format number with thousand separator
 * @param num - Number
 */
export function formatNumber(num: number | string): string {
  if (num === null || num === undefined || num === '') return '-';
  const n = typeof num === 'string' ? Number.parseFloat(num) : num;
  if (Number.isNaN(n)) return '-';
  return new Intl.NumberFormat('zh-CN').format(n);
}

/**
 * Format file size
 * @param bytes - Bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Truncate text with ellipsis
 * @param text - Text
 * @param maxLength - Max length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Mask sensitive information (phone, ID card, etc.)
 * @param str - String to mask
 * @param config - Mask config
 */
export function maskSensitive(str: string, config: { start?: number; end?: number; maskChar?: string } = {}): string {
  const { start = 3, end = 4, maskChar = '*' } = config;
  if (!str || str.length <= start + end) return str;
  const maskLength = str.length - start - end;
  return str.slice(0, start) + maskChar.repeat(maskLength) + str.slice(-end);
}

/**
 * Format phone number (mask middle digits)
 * @param phone - Phone number
 */
export function formatPhone(phone: string): string {
  if (!phone) return '-';
  return maskSensitive(phone, { start: 3, end: 4 });
}

/**
 * Format address (combine province, city, district, detail)
 * @param address - Address object
 */
export function formatAddress(address: Api.Admin.Harvest.AddressSnapshot | null | undefined): string {
  if (!address) return '-';
  const { province, city, district, detail } = address;
  return `${province || ''}${city || ''}${district || ''}${detail || ''}`;
}

/**
 * Format address short (province + city + district)
 * @param address - Address object
 */
export function formatAddressShort(address: Api.Admin.Harvest.AddressSnapshot | null | undefined): string {
  if (!address) return '-';
  const { province, city, district } = address;
  return `${province || ''}${city || ''}${district || ''}`;
}
