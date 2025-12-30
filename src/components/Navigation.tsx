import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getRoutesWithMeta, getNavigationItems } from '../router'
import { useUserStore } from '../stores/userStore'

interface NavItem {
  path: string
  label: string
  description: string
  canOpenWindow: boolean
}

const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const userStore = useUserStore()
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const routes = await getRoutesWithMeta()
        const items = getNavigationItems(routes)
        setNavItems(items)
      } catch (error) {
        console.error('Failed to load navigation items:', error)
        // 降级到默认导航项
        // setNavItems([
        //   { path: '/', label: '🏠 首页', description: '应用首页', canOpenWindow: false },
        //   { path: '/counter', label: '🔢 计数器', description: 'Zustand 状态管理示例', canOpenWindow: false },
        //   { path: '/about', label: 'ℹ️ 关于', description: '技术栈介绍', canOpenWindow: false }
        // ])
      } finally {
        setLoading(false)
      }
    }

    loadNavigation()
  }, [])

  const handleOpenInWindow = async (path: string, title: string) => {
    try {
      console.log('Opening window:', { path, title })
      if (window.electronAPI?.openWindow) {
        const result = await window.electronAPI.openWindow(path, title)
        console.log('Window open result:', result)
      } else {
        console.error('electronAPI.openWindow not available')
      }
    } catch (error) {
      console.error('Failed to open window:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await userStore.logoutAsync()
      console.log('👋 用户已登出')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <nav className="bg-[var(--gradient-primary)] text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* 品牌区域 */}
        <div>
          <h2 className="m-0 text-2xl font-semibold">
            ⚛️ Vite + React + Electron
          </h2>
          <p className="mt-1 opacity-80 text-sm">
            现代化桌面应用
          </p>
        </div>

        {/* 导航菜单 */}
        <div className="flex gap-4">
          {navItems.map((item) => (
            <div key={item.path} className="relative">
              <Link
                to={item.path}
                className={`px-4 py-2 text-white no-underline rounded-md font-medium transition-all duration-200 inline-block ${
                  location.pathname === item.path ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                title={item.description}
              >
                {item.label}
              </Link>
              {item.canOpenWindow && (
                <button
                  onClick={() => handleOpenInWindow(item.path, item.label.replace(/^[^\s]+\s/, ''))}
                  className="ml-1 px-2 py-1 bg-white/10 border-none rounded text-white cursor-pointer text-xs opacity-70 transition-opacity duration-200 hover:opacity-100"
                  title="在新窗口中打开"
                >
                  🪟
                </button>
              )}
            </div>
          ))}

          {/* 用户菜单（登录后显示） */}
          {userStore.isLoggedIn && (
            <>
              <div className="h-6 border-l border-white/20 mx-2"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-80">
                  {userStore.currentUser?.avatar} {userStore.currentUser?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-white/10 border-none rounded text-white cursor-pointer text-sm transition-colors duration-200 hover:bg-white/20"
                  title="登出"
                >
                  🚪 登出
                </button>
              </div>
            </>
          )}
        </div>

        {/* 窗口控制按钮 */}
        <div className="flex gap-1">
          <button
            onClick={() => window.electronAPI?.minimizeWindow()}
            className="p-1 bg-white/10 border-none rounded text-white cursor-pointer text-xs"
            title="最小化"
          >
            ─
          </button>
          <button
            onClick={() => window.electronAPI?.toggleMaximize()}
            className="p-1 bg-white/10 border-none rounded text-white cursor-pointer text-xs"
            title="最大化/还原"
          >
            □
          </button>
          <button
            onClick={() => window.electronAPI?.closeWindow()}
            className="p-1 bg-white/10 border-none rounded text-red-500 cursor-pointer text-xs"
            title="关闭"
          >
            ✕
          </button>
        </div>

        {/* 状态指示器 */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">
            运行中
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
