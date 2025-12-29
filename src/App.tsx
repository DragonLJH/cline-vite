import React, { Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import AppTop from './components/AppTop'
import { generateRoutes, getRoutesWithMeta, RouteConfig } from './router'
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

  return (
    <Router>
      <div className="app" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        {routesLoading ? (
          <div style={{
            height: '48px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px'
          }}>
            正在加载导航...
          </div>
        ) : (
          <AppTop routes={routes} />
        )}
        <main className="main-content" style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          margin: 0,
          padding: 0
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
    </Router>
  )
}

export default App
