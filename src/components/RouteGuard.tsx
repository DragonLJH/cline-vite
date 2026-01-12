// 路由守卫组件 - 检查用户权限并控制页面访问
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'
import { PermissionService } from '../services/permissionService'
import type { RouteConfig } from '../router'

interface RouteGuardProps {
  route: RouteConfig
  children: React.ReactNode
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ route, children }) => {
  const location = useLocation()
  const { currentUser, isLoggedIn } = useUserStore()

  // 检查是否需要登录
  if (route.meta?.requiresAuth && !isLoggedIn) {
    console.log(`🔒 页面 ${route.path} 需要登录，重定向到登录页`)
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 检查权限
  if (route.meta?.permissions && route.meta.permissions.length > 0) {
    const hasPermission = PermissionService.hasAllPermissions(
      currentUser,
      route.meta.permissions
    )

    if (!hasPermission) {
      console.log(`🚫 用户权限不足，拒绝访问页面 ${route.path}`)
      console.log(`需要的权限:`, route.meta.permissions)
      console.log(`用户权限:`, currentUser?.permissions || [])

      // 权限不足，显示无权限页面
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
          <div className="w-full max-w-md">
            <div className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border-primary)]">
              <div className="text-center">
                <div className="text-6xl mb-6">🚫</div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                  权限不足
                </h2>
                <p className="text-[var(--text-secondary)] mb-6">
                  您没有访问此页面的权限，请联系管理员或使用其他账号登录
                </p>

                {/* 权限详情 */}
                <div className="bg-[var(--bg-secondary)] p-4 rounded-xl mb-6">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                    权限要求
                  </h3>
                  <div className="space-y-2">
                    {route.meta.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">
                          {PermissionService.getPermissionDescription(permission)}
                        </span>
                        <span className="text-red-500">✕</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 用户信息 */}
                {currentUser && (
                  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl mb-6">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                      当前用户
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentUser.avatar}</span>
                      <div className="text-left">
                        <div className="font-medium text-[var(--text-primary)]">
                          {currentUser.name}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {PermissionService.getUserRoles(currentUser)
                            .map(role => role.name)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.history.back()}
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] py-2 px-4 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    返回
                  </button>
                  {!isLoggedIn ? (
                    <a
                      href="/login"
                      className="flex-1 bg-[var(--gradient-primary)] text-[var(--text-inverse)] py-2 px-4 rounded-lg text-center no-underline hover:opacity-90 transition-opacity"
                    >
                      登录
                    </a>
                  ) : (
                    <button
                      onClick={() => window.location.href = '/'}
                      className="flex-1 bg-[var(--gradient-primary)] text-[var(--text-inverse)] py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      首页
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // 权限检查通过，渲染子组件
  return <>{children}</>
}