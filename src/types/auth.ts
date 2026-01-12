// 认证和权限相关类型定义
export interface Role {
  id: string
  name: string
  description: string
  permissions: readonly string[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  roles: string[] // 角色ID列表
  permissions: string[] // 计算得出的权限列表
}

export interface PermissionCheck {
  hasPermission: boolean
  requiredPermissions: string[]
  userPermissions: string[]
}