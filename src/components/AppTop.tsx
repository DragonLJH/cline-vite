import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RouteConfig } from '../router'

interface AppTopProps {
  routes?: RouteConfig[]
}

const AppTop: React.FC<AppTopProps> = ({ routes = [] }) => {
  const location = useLocation()
  const [isMaximized, setIsMaximized] = useState(false)
  const [platform, setPlatform] = useState<string>('')

  // 从路由配置生成导航项
  const navItems = routes.map(route => ({
    path: route.path,
    label: route.meta?.icon ? `${route.meta.icon} ${route.meta.title}` : route.meta?.title || '未命名',
    description: route.meta?.description || ''
  }))

  useEffect(() => {
    // 获取平台信息
    if (window.electronAPI) {
      setPlatform(window.electronAPI.platform)
    }

    // 监听窗口最大化状态变化
    const handleMaximized = () => setIsMaximized(true)
    const handleUnmaximized = () => setIsMaximized(false)

    if (window.electronAPI) {
      window.electronAPI.on('window:maximized', handleMaximized)
      window.electronAPI.on('window:unmaximized', handleUnmaximized)
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.off('window:maximized', handleMaximized)
        window.electronAPI.off('window:unmaximized', handleUnmaximized)
      }
    }
  }, [])

  const handleMinimize = () => {
    if (window.electronAPI) {
      try {
        window.electronAPI.minimizeWindow()
      } catch (error) {
        console.error('Failed to minimize window:', error)
      }
    } else {
      console.error('electronAPI not available')
    }
  }

  const handleMaximize = () => {
    if (window.electronAPI) {
      try {
        window.electronAPI.toggleMaximize()
      } catch (error) {
        console.error('Failed to toggle maximize:', error)
      }
    } else {
      console.error('electronAPI not available')
    }
  }

  const handleClose = () => {
    if (window.electronAPI) {
      try {
        window.electronAPI.closeWindow()
      } catch (error) {
        console.error('Failed to close window:', error)
      }
    } else {
      console.error('electronAPI not available')
    }
  }

  const handleDoubleClick = () => {
    if (platform === 'win32') {
      handleMaximize()
    }
  }

  // 根据平台决定是否显示窗口控制按钮
  const showWindowControls = platform === 'win32'

  return (
    <div
      className="app-top"
      onDoubleClick={handleDoubleClick}
      style={{
        height: '48px',
        background: 'var(--gradient-primary)',
        color: 'var(--text-inverse)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'relative',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        cursor: platform === 'win32' ? 'default' : 'auto'
      } as any}
    >
      {/* 左侧：品牌和导航 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* 品牌信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            ⚛️
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', lineHeight: '1' }}>
              Vite + React + Electron
            </div>
            <div style={{ fontSize: '10px', opacity: 0.8, lineHeight: '1' }}>
              现代化桌面应用
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav style={{ display: 'flex', gap: '4px' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '8px 12px',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'all 0.2s'
              } as any}
              title={item.description}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 右侧：状态指示器和窗口控制 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* 开发环境指示器 */}
        {window.electronAPI?.appInfo.isDev && (
          <div style={{
            padding: '4px 8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '500'
          }}>
            DEV
          </div>
        )}

        {/* 平台信息 */}
        <div style={{
          padding: '4px 8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: '500'
        }}>
          {platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : platform === 'linux' ? 'Linux' : platform}
        </div>

        {/* 窗口控制按钮（仅 Windows） */}
        {showWindowControls && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          } as any}>
            <button
              onClick={handleMinimize}
              style={{
                width: '32px',
                height: '24px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                fontSize: '12px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="最小化"
            >
              ─
            </button>
            <button
              onClick={handleMaximize}
              style={{
                width: '32px',
                height: '24px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                fontSize: '12px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title={isMaximized ? '还原' : '最大化'}
            >
              {isMaximized ? '❐' : '□'}
            </button>
            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '24px',
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                fontSize: '12px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#ef4444'
              }}
              title="关闭"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 拖拽区域指示器（仅在 Windows 开发模式显示） */}
      {platform === 'win32' && window.electronAPI?.appInfo.isDev && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: 'rgba(0,255,0,0.05)',
          border: '1px dashed rgba(0,255,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: 'rgba(0,255,0,0.7)',
          fontWeight: '500'
        }}>
          可拖拽区域 (双击最大化)
        </div>
      )}
    </div>
  )
}

export default AppTop
