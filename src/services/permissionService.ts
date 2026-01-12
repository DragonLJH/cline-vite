// 权限计算和管理服务
import { ROLES, PERMISSIONS } from '../config/permissions'
import type { User, Role, PermissionCheck } from '../types/auth'

export class PermissionService {
  /**
   * 计算用户权限（基于角色）
   */
  static calculateUserPermissions(user: User): string[] {
    if (!user.roles || user.roles.length === 0) {
      return []
    }

    const permissions = new Set<string>()

    user.roles.forEach(roleId => {
      const role = Object.values(ROLES).find(r => r.id === roleId)
      if (role) {
        role.permissions.forEach(permission => permissions.add(permission))
      }
    })

    return Array.from(permissions)
  }

  /**
   * 检查用户是否有指定权限
   */
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false

    const userPermissions = user.permissions || this.calculateUserPermissions(user)
    return userPermissions.includes(permission)
  }

  /**
   * 检查用户是否有任意一个权限
   */
  static hasAnyPermission(user: User | null, permissions: string[]): boolean {
    if (!user) return false

    const userPermissions = user.permissions || this.calculateUserPermissions(user)
    return permissions.some(permission => userPermissions.includes(permission))
  }

  /**
   * 检查用户是否有所有指定权限
   */
  static hasAllPermissions(user: User | null, permissions: string[]): boolean {
    if (!user) return false

    const userPermissions = user.permissions || this.calculateUserPermissions(user)
    return permissions.every(permission => userPermissions.includes(permission))
  }

  /**
   * 获取用户角色信息
   */
  static getUserRoles(user: User): Role[] {
    if (!user.roles) return []

    return user.roles
      .map(roleId => Object.values(ROLES).find(r => r.id === roleId))
      .filter(Boolean) as Role[]
  }

  /**
   * 检查路由权限
   */
  static checkRoutePermission(user: User | null, requiredPermissions?: string[]): PermissionCheck {
    const result: PermissionCheck = {
      hasPermission: false,
      requiredPermissions: requiredPermissions || [],
      userPermissions: user?.permissions || []
    }

    if (!requiredPermissions || requiredPermissions.length === 0) {
      result.hasPermission = true
      return result
    }

    result.hasPermission = this.hasAllPermissions(user, requiredPermissions)
    return result
  }

  /**
   * 获取权限描述
   */
  static getPermissionDescription(permission: string): string {
    const descriptions: Record<string, string> = {
      [PERMISSIONS.SYSTEM_ADMIN]: '系统管理',
      [PERMISSIONS.USER_MANAGE]: '用户管理',
      [PERMISSIONS.PAGE_SETTINGS]: '设置页面访问',
      [PERMISSIONS.PAGE_ADMIN]: '管理员页面访问',
      [PERMISSIONS.THEME_CHANGE]: '主题切换',
      [PERMISSIONS.WINDOW_OPEN]: '新窗口打开',
    }

    return descriptions[permission] || permission
  }

  /**
   * 获取角色描述
   */
  static getRoleDescription(roleId: string): string {
    const role = Object.values(ROLES).find(r => r.id === roleId)
    return role?.description || roleId
  }

  /**
   * 验证权限字符串格式
   */
  static isValidPermission(permission: string): boolean {
    return Object.values(PERMISSIONS).includes(permission as any)
  }

  /**
   * 获取所有可用权限
   */
  static getAllPermissions(): string[] {
    return Object.values(PERMISSIONS)
  }

  /**
   * 获取所有可用角色
   */
  static getAllRoles(): Role[] {
    return Object.values(ROLES)
  }
}