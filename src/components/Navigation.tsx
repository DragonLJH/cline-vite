import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '🏠 首页', description: '应用首页' },
    { path: '/counter', label: '🔢 计数器', description: 'Zustand 状态管理示例' },
    { path: '/about', label: 'ℹ️ 关于', description: '技术栈介绍' }
  ]

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* 品牌区域 */}
        <div>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            ⚛️ Vite + React + Electron
          </h2>
          <p style={{
            margin: '0.25rem 0 0 0',
            opacity: 0.8,
            fontSize: '0.9rem'
          }}>
            现代化桌面应用
          </p>
        </div>

        {/* 导航菜单 */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '0.5rem 1rem',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'all 0.2s'
              }}
              title={item.description}
            >
              {item.label}
            </Link>
          ))}
        </div>

          {/* 窗口控制按钮 */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => window.electronAPI?.minimizeWindow()}
              style={{
                padding: '0.25rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
              title="最小化"
            >
              ─
            </button>
            <button
              onClick={() => window.electronAPI?.toggleMaximize()}
              style={{
                padding: '0.25rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
              title="最大化/还原"
            >
              □
            </button>
            <button
              onClick={() => window.electronAPI?.closeWindow()}
              style={{
                padding: '0.25rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '4px',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
              title="关闭"
            >
              ✕
            </button>
          </div>

          {/* 状态指示器 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px'
          }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#10b981',
            borderRadius: '50%'
          }}></div>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            运行中
          </span>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
