declare namespace Api {
  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    /**
     * User type
     * 用户类型: 管理员或普通用户
     */
    type UserType = 'admin' | 'regular';

    /**
     * Login token (for regular users)
     * 登录令牌 (普通用户)
     */
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    /**
     * User info (for regular users)
     * 用户信息 (普通用户)
     */
    interface UserInfo {
      userId: string;
      userName: string;
      roles: string[];
      buttons: string[];
    }

    /**
     * Admin info (for admin users)
     * 管理员信息 (管理员用户)
     */
    interface AdminInfo {
      id: number;
      username: string;
      role: 'super_admin' | 'admin' | 'operator';
      status: 0 | 1;
      created_at: string;
      updated_at: string;
    }
  }
}
