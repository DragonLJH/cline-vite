import React, { Suspense, useState, useEffect, useMemo } from 'react'
import { HashRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom'
import AppTop from './components/AppTop'
import { RouteGuard } from './components/RouteGuard'
import { PermissionAwareNavigation } from './components/PermissionAwareNavigation'
import { generateRoutes, getRoutesWithMeta, RouteConfig, getNavigationItems } from './router'
// 导入主题系统，确保在应用启动时初始化
import './stores/themeStore'
import './App.scss'

// 加载组件
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-48 text-lg text-gray-500">
    <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
)

// 路由组件包装器
const RouteWrapper: React.FC<{ route: RouteConfig }> = ({ route }) => {
  const Component = route.component
  return (
    <RouteGuard route={route}>
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    </RouteGuard>
  )
}



// 应用根组件
function App() {
  const [routes, setRoutes] = useState<RouteConfig[]>([])
  const [routesLoading, setRoutesLoading] = useState(true)

  useEffect(() => {
    // 异步获取包含元数据的路由配置
    getRoutesWithMeta().then((routesWithMeta) => {
      setRoutes(routesWithMeta)
      setRoutesLoading(false)
      console.log('🎯 路由元数据加载完成:', routesWithMeta.length, '个页面')
    }).catch((error) => {
      console.error('❌ 路由配置加载失败:', error)
      setRoutesLoading(false)
    })

    // 监听登录成功事件（仅在主窗口中）
    if (window.electronAPI?.onLoginSuccess) {
      const handleLoginSuccess = (userData: any) => {
        console.log('📥 收到登录成功事件:', userData)

        // 导入用户store并更新状态
        import('./stores/userStore').then(({ useUserStore }) => {
          const userStore = useUserStore.getState()
          userStore.login(userData)
          console.log('✅ 主窗口用户状态已更新:', userData.name)
        }).catch((error) => {
          console.error('❌ 更新用户状态失败:', error)
        })
      }

      window.electronAPI.onLoginSuccess(handleLoginSuccess)

      return () => {
        // 清理事件监听
        if (window.electronAPI?.off) {
          window.electronAPI.off('login:success', handleLoginSuccess)
        }
      }
    }
  }, [])

  if (routesLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          正在加载应用...
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="app h-screen flex m-0 p-0 overflow-hidden">
        {/* 顶部标题栏 */}
        <AppTop routes={routes} />

        {/* 主体内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 顶部权限感知导航栏 */}
          <PermissionAwareNavigation routes={routes} />

          {/* 主要内容 */}
          <main className="main-content flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-primary)]">
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<RouteWrapper route={route} />}
                />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
