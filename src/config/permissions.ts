// 权限和角色配置定义
export const PERMISSIONS = {
  // 系统管理权限
  SYSTEM_ADMIN: 'system:admin',
  USER_MANAGE: 'user:manage',

  // 页面访问权限
  PAGE_SETTINGS: 'page:settings',
  PAGE_ADMIN: 'page:admin',

  // 功能权限
  THEME_CHANGE: 'theme:change',
  WINDOW_OPEN: 'window:open',
} as const

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS]

export const ROLES = {
  ADMIN: {
    id: 'admin',
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: Object.values(PERMISSIONS)
  },
  USER: {
    id: 'user',
    name: '普通用户',
    description: '普通用户，基础功能权限',
    permissions: [
      PERMISSIONS.THEME_CHANGE,
      PERMISSIONS.WINDOW_OPEN,
      // 不包含系统管理权限
    ]
  },
  GUEST: {
    id: 'guest',
    name: '访客',
    description: '未登录用户，仅基础浏览权限',
    permissions: []
  }
} as const

export type RoleType = typeof ROLES[keyof typeof ROLES]