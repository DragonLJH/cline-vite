// 权限感知导航组件 - 根据用户权限动态显示菜单项
import React, { useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'
import { PermissionService } from '../services/permissionService'
import { getNavigationItems } from '../router'
import { useWindowType } from '../hooks/useWindowType'
import type { RouteConfig } from '../router'

interface NavItem {
  path: string
  label: string
  description: string
  canOpenWindow: boolean
}

interface PermissionAwareNavigationProps {
  routes: RouteConfig[]
}

export const PermissionAwareNavigation: React.FC<PermissionAwareNavigationProps> = ({
  routes
}) => {
  const location = useLocation()
  const { currentUser } = useUserStore()
  const { shouldShowNavigation } = useWindowType()


  // 新窗口不显示导航
  if (!shouldShowNavigation) {
    return null
  }

  // 根据用户权限过滤导航项
  const filteredNavItems = useMemo(() => {
    return getNavigationItems(routes).filter(item => {
      // 查找对应的路由配置
      const route = routes.find(r => r.path === item.path)
      if (!route?.meta?.permissions || route.meta.permissions.length === 0) {
        return true // 无权限要求，直接显示
      }

      // 检查用户是否有权限
      return PermissionService.hasAllPermissions(currentUser, route.meta.permissions)
    })
  }, [routes, currentUser])

  const handleOpenInWindow = async (path: string, title: string) => {
    // 检查用户是否有打开窗口权限
    if (!PermissionService.hasPermission(currentUser, 'window:open')) {
      console.warn('🚫 用户没有新窗口打开权限')
      // 可以显示一个提示消息
      alert('您没有在新窗口中打开页面的权限')
      return
    }

    try {
      console.log('🪟 正在新窗口中打开:', { path, title })
      if (window.electronAPI?.openWindow) {
        const result = await window.electronAPI.openWindow(path, title)
        console.log('🪟 窗口打开结果:', result)
      } else {
        console.error('❌ electronAPI.openWindow 不可用')
      }
    } catch (error) {
      console.error('❌ 打开窗口失败:', error)
    }
  }

  return (
    <nav className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] p-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* 导航菜单 */}
        <div className="flex gap-2 flex-1 overflow-x-auto">
          {filteredNavItems.map((item) => (
            <div key={item.path} className="flex items-center gap-1 flex-shrink-0">
              <Link
                to={item.path}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${location.pathname === item.path
                  ? 'bg-[var(--gradient-primary)] text-[var(--text-inverse)] shadow-md hover:shadow-lg'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:shadow-md hover:-translate-y-0.5'
                  }`}
                title={item.description}
              >
                {item.label}
              </Link>
              {item.canOpenWindow && (
                <button
                  onClick={() => handleOpenInWindow(item.path, item.label.replace(/^[^\s]+\s/, ''))}
                  className="px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md text-[var(--text-secondary)] opacity-70 transition-all duration-200 hover:opacity-100 hover:bg-[var(--gradient-primary)] hover:text-[var(--text-inverse)]"
                  title="在新窗口中打开"
                  aria-label={`在新窗口中打开 ${item.label}`}
                >
                  🪟
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 用户状态指示器 */}
        <div className="flex-shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg text-sm">
              <span className="text-xl">{currentUser.avatar}</span>
              <span className="font-semibold text-[var(--text-primary)]">{currentUser.name}</span>
              <span className="text-[var(--text-secondary)] text-xs">
                {PermissionService.getUserRoles(currentUser)
                  .map(role => role.name)
                  .join(', ')}
              </span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-[var(--text-muted)] text-sm">
              未登录
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
