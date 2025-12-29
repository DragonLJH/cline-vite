import React from 'react'

const HomePage: React.FC = () => {
  const features = [
    { icon: '⚡', name: 'Vite', desc: '快速的构建工具' },
    { icon: '⚛️', name: 'React', desc: '用户界面库' },
    { icon: '🔷', name: 'TypeScript', desc: '类型安全的 JavaScript' },
    { icon: '🖥️', name: 'Electron', desc: '跨平台桌面应用' },
    { icon: '🧭', name: 'React Router', desc: '页面路由系统' },
    { icon: '📦', name: 'Zustand', desc: '轻量级状态管理' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* 头部区域 */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏠 首页
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            欢迎来到 Vite + React + TypeScript + Electron 现代化桌面应用！
          </p>
        </div>

        {/* 功能特性网格 */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--text-primary)'
          }}>
            🎯 核心特性
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border-primary)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  {feature.name}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 快速导航 */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-primary)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--text-primary)'
          }}>
            🧭 快速导航
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <a
              href="/counter"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                background: 'var(--gradient-secondary)',
                color: 'var(--text-inverse)',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1.125rem',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🔢</span>
              计数器页面
            </a>
            <a
              href="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                background: 'var(--gradient-primary)',
                color: 'var(--text-inverse)',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1.125rem',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>ℹ️</span>
              关于页面
            </a>
          </div>
        </div>

        {/* 底部信息 */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            开始探索这个现代化桌面应用的功能吧！
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
