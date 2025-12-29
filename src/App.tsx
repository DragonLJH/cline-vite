import React, { Suspense, useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import AppTop from './components/AppTop'
import { generateRoutes, getRoutesWithMeta, RouteConfig, getNavigationItems } from './router'
// 导入主题系统，确保在应用启动时初始化
import './stores/themeStore'
import './App.css'

// 加载组件
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.125rem',
    color: '#6b7280'
  }}>
    <div style={{
      width: '24px',
      height: '24px',
      border: '2px solid #e5e7eb',
      borderTop: '2px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

// 路由组件包装器
const RouteWrapper: React.FC<{ route: RouteConfig }> = ({ route }) => {
  const Component = route.component
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  )
}

// 导航侧边栏组件
const Sidebar: React.FC<{ routes: RouteConfig[] }> = ({ routes }) => {
  const location = useLocation()
  const [navItems, setNavItems] = useState<any[]>([])

  useEffect(() => {
    const items = getNavigationItems(routes)
    setNavItems(items)
  }, [routes])

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

  return (
    <aside style={{
      width: '280px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-primary)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem 0'
    }}>
      {/* 侧边栏头部 */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid var(--border-primary)',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          🧭 页面导航
        </h2>
      </div>

      {/* 导航菜单 */}
      <nav style={{ flex: 1, padding: '0 1rem' }}>
        {navItems.map((item) => (
          <div key={item.path} style={{
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Link
              to={item.path}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: location.pathname === item.path ? 'var(--gradient-primary)' : 'var(--bg-card)',
                color: location.pathname === item.path ? 'var(--text-inverse)' : 'var(--text-primary)',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '0.95rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s',
                border: location.pathname === item.path ? 'none' : '1px solid var(--border-primary)',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {item.label}
            </Link>
            {item.canOpenWindow && (
              <button
                onClick={() => handleOpenInWindow(item.path, item.label.replace(/^[^\s]+\s/, ''))}
                style={{
                  padding: '0.5rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  opacity: 0.7,
                  transition: 'all 0.2s',
                  minWidth: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="在新窗口中打开"
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.background = 'var(--gradient-primary)';
                  e.currentTarget.style.color = 'var(--text-inverse)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                🪟
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

// 应用根组件
function App() {
  const [routes, setRoutes] = React.useState<RouteConfig[]>([])
  const [routesLoading, setRoutesLoading] = React.useState(true)

  React.useEffect(() => {
    // 异步获取包含元数据的路由配置
    getRoutesWithMeta().then((routesWithMeta) => {
      setRoutes(routesWithMeta)
      setRoutesLoading(false)
      console.log('🎯 路由元数据加载完成:', routesWithMeta.length, '个页面')
    }).catch((error) => {
      console.error('❌ 路由配置加载失败:', error)
      setRoutesLoading(false)
    })
  }, [])

  if (routesLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: '1.125rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid var(--border-primary)',
            borderTop: '2px solid var(--gradient-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          正在加载应用...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // 检查是否在新窗口中（通过URL hash参数或window.opener）
  const isInNewWindow = window.location.hash.includes('newwindow=true') || !!window.opener

  return (
    <Router>
      <div className="app" style={{
        height: '100vh',
        display: 'flex',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        {/* 顶部标题栏 */}
        <AppTop routes={routes} />

        {/* 主体内容区域 */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}>
          {/* 左侧导航侧边栏（仅在主窗口中显示） */}
          {!isInNewWindow && <Sidebar routes={routes} />}

          {/* 主要内容 */}
          <main className="main-content" style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            background: 'var(--bg-primary)'
          }}>
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
