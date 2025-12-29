import React from 'react'
import { useThemeStore, type ThemeType } from '../../stores/themeStore'

const SettingsPage: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore()

  const themeOptions: { value: ThemeType; label: string; icon: string; description: string }[] = [
    {
      value: 'light',
      label: '浅色主题',
      icon: '☀️',
      description: '明亮、清爽的视觉体验'
    },
    {
      value: 'dark',
      label: '深色主题',
      icon: '🌙',
      description: '护眼的深色界面设计'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* 页面标题 */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⚙️ 设置
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem'
          }}>
            个性化您的应用体验
          </p>
        </div>

        {/* 设置卡片容器 */}
        <div style={{
          display: 'grid',
          gap: '2rem'
        }}>

          {/* 主题设置卡片 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.3s'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontSize: '2rem',
                marginRight: '1rem'
              }}>
                🎨
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: 'var(--text-primary)'
                }}>
                  主题设置
                </h2>
                <p style={{
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  选择您喜欢的视觉主题
                </p>
              </div>
            </div>

            {/* 主题选项 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {themeOptions.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1.5rem',
                    border: `2px solid ${theme === option.value ? 'var(--border-focus)' : 'var(--border-primary)'}`,
                    borderRadius: '12px',
                    background: theme === option.value ? 'var(--bg-hover)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (theme !== option.value) {
                      e.currentTarget.style.borderColor = 'var(--border-secondary)'
                      e.currentTarget.style.background = 'var(--bg-hover)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (theme !== option.value) {
                      e.currentTarget.style.borderColor = 'var(--border-primary)'
                      e.currentTarget.style.background = 'var(--bg-card)'
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={theme === option.value}
                    onChange={(e) => setTheme(e.target.value as ThemeType)}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* 选中指示器 */}
                  {theme === option.value && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--btn-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      ✓
                    </div>
                  )}

                  {/* 主题图标和信息 */}
                  <div style={{
                    fontSize: '2rem',
                    marginRight: '1rem',
                    opacity: theme === option.value ? 1 : 0.7
                  }}>
                    {option.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                      color: 'var(--text-primary)'
                    }}>
                      {option.label}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      margin: 0
                    }}>
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* 快速切换按钮 */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-primary)'
            }}>
              <button
                onClick={toggleTheme}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  background: 'var(--btn-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--btn-primary-hover)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--btn-primary)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>
                  {theme === 'light' ? '🌙' : '☀️'}
                </span>
                快速切换到{theme === 'light' ? '深色' : '浅色'}主题
              </button>
            </div>
          </div>

          {/* 其他设置卡片占位符 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            opacity: 0.6
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{
                fontSize: '2rem',
                marginRight: '1rem'
              }}>
                🔄
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: 'var(--text-primary)'
                }}>
                  更多设置
                </h2>
                <p style={{
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  敬请期待更多个性化选项
                </p>
              </div>
            </div>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              margin: 0
            }}>
              未来版本将添加更多设置选项，包括语言、通知、数据管理等功能。
            </p>
          </div>

        </div>

        {/* 底部信息 */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-primary)'
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            设置会自动保存到本地存储，重启应用后仍然生效。
          </p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
