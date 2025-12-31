/**
 * Admin API type definitions
 * 挖挖农场后台管理系统 API 类型定义
 */

declare namespace Api {
  namespace Admin {
    // ===== 通用类型 =====
    /** 分页参数 */
    interface PaginationParams {
      page?: number;
      page_size?: number;
    }

    /** 分页响应 */
    interface PaginationResponse<T> {
      list: T[];
      page: number;
      page_size: number;
      total: number;
    }

    // ===== 管理员认证 =====
    namespace Auth {
      /** 登录请求 */
      interface LoginRequest {
        username: string;
        password: string;
      }

      /** 登录响应 */
      interface LoginResponse {
        admin_id: number;
        username: string;
        role: 'super_admin' | 'admin' | 'operator';
      }

      /** 管理员信息 */
      interface AdminInfo {
        id: number;
        username: string;
        role: string;
        status: 0 | 1;
        created_at: string;
        updated_at: string;
      }
    }

    // ===== 用户管理 =====
    namespace User {
      /** 用户基本信息 */
      interface UserInfo {
        id: number;
        nickname: string;
        avatar_url: string;
        status: 0 | 1;
        last_login_at: string;
        created_at: string;
        updated_at: string;
      }

      /** 用户游戏状态 */
      interface UserGameState {
        level: number;
        growth: number;
        total_growth: number;
        fertilizer_amount: number;
        max_daily_fertilize_count: number;
        current_seed_id: number;
        current_round_id: number;
        can_harvest: boolean;
        is_harvested: boolean;
      }

      /** 用户第三方登录信息 */
      interface UserIdentity {
        identity_type: string;
        open_id: string;
        union_id: string;
        created_at: string;
      }

      /** 用户详情 */
      interface UserDetail {
        user: UserInfo;
        game_state: UserGameState;
        identities: UserIdentity[];
      }

      /** 用户列表参数 */
      type UserListParams = PaginationParams;

      /** 用户列表响应 */
      type UserListResponse = PaginationResponse<UserInfo>;

      /** 更新状态请求 */
      interface UpdateStatusRequest {
        status: 0 | 1;
      }

      /** 调整肥料请求 */
      interface AdjustFertilizerRequest {
        amount: number;
        reason: string;
      }

      /** 更新最大施肥次数请求 */
      interface UpdateMaxFertilizeCountRequest {
        max_daily_fertilize_count: number;
      }
    }

    // ===== 种子管理 =====
    namespace Seed {
      /** 种子配置 */
      interface SeedConfig {
        id: number;
        name: string;
        icon_url: string;
        reward_type: string;
        shop_sku_id?: string;
        coupon_id?: string;
        sort_order: number;
        status: 0 | 1;
        created_at: string;
        updated_at: string;
      }

      /** 种子列表参数 */
      type SeedListParams = PaginationParams;

      /** 种子列表响应 */
      type SeedListResponse = PaginationResponse<SeedConfig>;

      /** 创建种子请求 */
      interface CreateSeedRequest {
        name: string;
        icon_url: string;
        shop_sku_id?: string;
        coupon_id?: string;
        sort_order?: number;
        status?: 0 | 1;
      }

      /** 更新种子请求 */
      interface UpdateSeedRequest {
        name?: string;
        icon_url?: string;
        shop_sku_id?: string;
        coupon_id?: string;
        sort_order?: number;
      }

      /** 更新种子状态请求 */
      interface UpdateSeedStatusRequest {
        status: 0 | 1;
      }
    }

    // ===== 任务管理 =====
    namespace Task {
      /** 任务配置 */
      interface TaskConfig {
        id: number;
        task_name: string;
        task_type: string;
        description: string;
        reward: number;
        max_count: number;
        is_one_time: boolean;
        is_enabled: boolean;
        need_claim: boolean;
        sort_order: number;
        created_at: string;
        updated_at: string;
      }

      /** 任务列表参数 */
      type TaskListParams = PaginationParams;

      /** 任务列表响应 */
      type TaskListResponse = PaginationResponse<TaskConfig>;

      /** 创建任务请求 */
      interface CreateTaskRequest {
        task_name: string;
        task_type: string;
        description?: string;
        reward: number;
        max_count: number;
        is_one_time?: boolean;
        is_enabled?: boolean;
        need_claim?: boolean;
        sort_order?: number;
      }

      /** 更新任务请求 */
      interface UpdateTaskRequest {
        task_name?: string;
        description?: string;
        reward?: number;
        max_count?: number;
        is_one_time?: boolean;
        is_enabled?: boolean;
        need_claim?: boolean;
        sort_order?: number;
      }
    }

    // ===== 收获记录管理 =====
    namespace Harvest {
      /** 收获记录状态 */
      type HarvestStatus = 'unredeemed' | 'pending' | 'shipped' | 'completed' | 'cancelled';

      /** 地址快照 */
      interface AddressSnapshot {
        name: string;
        phone: string;
        province: string;
        city: string;
        district: string;
        detail: string;
      }

      /** 种子快照 */
      interface SeedSnapshot {
        name: string;
        icon_url: string;
        reward_type: string;
        shop_sku_id?: string;
        coupon_id?: string;
      }

      /** 收获记录 */
      interface HarvestRecord {
        id: number;
        user_id: number;
        tree_id: number;
        seed_id: number;
        round_id: number;
        status: HarvestStatus;
        seed_data: SeedSnapshot;
        address_data: AddressSnapshot;
        tracking_no?: string;
        created_at: string;
        redeemed_at?: string;
        shipped_at?: string;
        completed_at?: string;
        updated_at: string;
      }

      /** 收获记录列表参数 */
      interface HarvestListParams extends PaginationParams {
        status?: HarvestStatus;
      }

      /** 收获记录列表响应 */
      interface HarvestListResponse {
        records: HarvestRecord[];
        page: number;
        size: number;
        total: number;
      }

      /** 更新状态请求 */
      interface UpdateStatusRequest {
        status: HarvestStatus;
      }

      /** 更新快递单号请求 */
      interface UpdateTrackingNoRequest {
        tracking_no: string;
      }
    }

    // ===== 订单补单 =====
    namespace Order {
      /** 补单支付请求 */
      interface RepairPayRequest {
        order_id: string;
      }

      /** 补单取消请求 */
      interface RepairCancelRequest {
        order_id: string;
      }
    }
  }
}
