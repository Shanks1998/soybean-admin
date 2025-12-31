/**
 * Business constants for Admin Management System
 * 管理端业务常量定义
 */

// ===== 管理员角色 =====
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  OPERATOR: 'operator'
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

// ===== 管理员角色映射 =====
export const ADMIN_ROLE_MAP: Record<
  AdminRole,
  {
    label: string;
    type: 'error' | 'warning' | 'info';
  }
> = {
  super_admin: { label: '超级管理员', type: 'error' },
  admin: { label: '管理员', type: 'warning' },
  operator: { label: '操作员', type: 'info' }
};

// ===== 用户状态 =====
export const USER_STATUS = {
  NORMAL: 0,
  DISABLED: 1
} as const;

export const USER_STATUS_MAP: Record<
  number,
  {
    label: string;
    type: 'success' | 'error';
  }
> = {
  0: { label: '正常', type: 'success' },
  1: { label: '禁用', type: 'error' }
};

// ===== 种子状态 =====
export const SEED_STATUS = {
  ENABLED: 0,
  DISABLED: 1
} as const;

export const SEED_STATUS_MAP: Record<
  number,
  {
    label: string;
    type: 'success' | 'error';
  }
> = {
  0: { label: '启用', type: 'success' },
  1: { label: '禁用', type: 'error' }
};

// ===== 收获记录状态 =====
export const HARVEST_STATUS = {
  UNREDEEMED: 'unredeemed',
  PENDING: 'pending',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type HarvestStatus = (typeof HARVEST_STATUS)[keyof typeof HARVEST_STATUS];

export const HARVEST_STATUS_MAP: Record<
  HarvestStatus,
  {
    label: string;
    type: 'default' | 'warning' | 'info' | 'success' | 'error';
  }
> = {
  unredeemed: { label: '未兑换', type: 'default' },
  pending: { label: '待发货', type: 'warning' },
  shipped: { label: '已发货', type: 'info' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'error' }
};

// ===== 收获记录状态选项（用于筛选） =====
export const HARVEST_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '未兑换', value: HARVEST_STATUS.UNREDEEMED },
  { label: '待发货', value: HARVEST_STATUS.PENDING },
  { label: '已发货', value: HARVEST_STATUS.SHIPPED },
  { label: '已完成', value: HARVEST_STATUS.COMPLETED },
  { label: '已取消', value: HARVEST_STATUS.CANCELLED }
];

// ===== 任务类型 =====
export const TASK_TYPES = [
  { label: '浏览商品', value: 'browse_product' },
  { label: '每日登录', value: 'daily_login' },
  { label: '分享', value: 'share' },
  { label: '邀请好友', value: 'invite_friend' },
  { label: '添加到我的小程序', value: 'add_to_home_screen' },
  { label: '累计肥料奖励', value: 'cumulative_fertilizer_reward' },
  { label: '跳转小程序', value: 'mini_program_jump' }
];

// ===== 权限配置 =====
export const ADMIN_PERMISSIONS = {
  user: {
    view: ['super_admin', 'admin', 'operator'],
    edit: ['super_admin', 'admin'],
    delete: ['super_admin']
  },
  seed: {
    view: ['super_admin', 'admin', 'operator'],
    create: ['super_admin', 'admin'],
    edit: ['super_admin', 'admin'],
    delete: ['super_admin']
  },
  task: {
    view: ['super_admin', 'admin', 'operator'],
    create: ['super_admin', 'admin'],
    edit: ['super_admin', 'admin'],
    delete: ['super_admin']
  },
  harvest: {
    view: ['super_admin', 'admin', 'operator'],
    edit: ['super_admin', 'admin']
  },
  order: {
    repair: ['super_admin']
  }
} as const;

// ===== 分页默认值 =====
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];
