import React from 'react'

const AboutPage: React.FC = () => {
  const techStack = [
    {
      title: '前端框架',
      items: ['⚛️ React 19', '🔷 TypeScript', '🧭 React Router v6']
    },
    {
      title: '构建工具',
      items: ['⚡ Vite', '📦 Electron Builder']
    },
    {
      title: '状态管理',
      items: ['📦 Zustand', '🔄 React Hooks']
    },
    {
      title: '样式系统',
      items: ['🎨 Tailwind CSS', '🛠️ SCSS', '📱 响应式设计']
    }
  ]

  const features = [
    '🚀 快速的热重载开发体验',
    '📱 响应式设计，支持多种屏幕尺寸',
    '🔒 类型安全的 TypeScript 支持',
    '🗂️ 模块化的项目结构',
    '🎨 现代化的 UI 设计',
    '⚡ 优化的构建和打包流程'
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* 头部 */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ℹ️ 关于我们
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            这是一个使用现代技术栈构建的桌面应用程序
          </p>
        </div>

        {/* 技术栈 */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#1e293b'
          }}>
            🛠️ 技术栈
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {techStack.map((category, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <h3 style={{
                  marginTop: 0,
                  marginBottom: '1rem',
                  color: '#374151',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  {category.title}
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      style={{
                        margin: '0.5rem 0',
                        padding: '0.25rem 0',
                        color: '#6b7280'
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 主要特性 */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          padding: '2rem',
          borderRadius: '16px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#1e293b'
          }}>
            ✨ 主要特性
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  color: '#374151'
                }}
              >
                <span style={{ marginRight: '0.75rem' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 系统信息和 API 演示 */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            🔧 系统信息和 API 演示
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {window.electronAPI?.platform || '未知'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>操作系统</div>
            </div>
            <div style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                {window.electronAPI?.version || '未知'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Electron 版本</div>
            </div>
            <div style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {window.electronAPI?.appInfo.isDev ? '开发环境' : '生产环境'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>运行模式</div>
            </div>
          </div>

          {/* API 功能演示 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => window.electronAPI?.showNotification({
                title: '测试通知',
                body: '这是一个来自 Electron 的通知！'
              })}
              style={{
                padding: '0.75rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              📢 显示通知
            </button>
            <button
              onClick={async () => {
                const result = await window.electronAPI?.openFileDialog({
                  title: '选择一个文件',
                  filters: [{ name: '所有文件', extensions: ['*'] }]
                })
                if (result && result.length > 0) {
                  alert(`选择了文件: ${result[0]}`)
                }
              }}
              style={{
                padding: '0.75rem 1rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              📁 打开文件
            </button>
            <button
              onClick={() => {
                const text = window.electronAPI?.clipboard.readText() || '剪贴板为空'
                alert(`剪贴板内容: ${text}`)
              }}
              style={{
                padding: '0.75rem 1rem',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              📋 读取剪贴板
            </button>
          </div>

          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            通过 Preload API 安全地访问系统功能，无需 nodeIntegration
          </p>
        </div>

        {/* 项目信息 */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1e293b'
          }}>
            📂 项目信息
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>v1.0.0</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>版本</div>
            </div>
            <div style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>React + TS</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>技术栈</div>
            </div>
            <div style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>Electron</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>运行环境</div>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            一个现代化的桌面应用程序示例项目
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
