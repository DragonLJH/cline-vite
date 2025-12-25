import React from 'react'
import { useCounterStore } from '../../stores/counterStore'

const CounterPage: React.FC = () => {
  const { count, increment, decrement, reset, incrementBy, decrementBy } = useCounterStore()

  const getStatusColor = () => {
    if (count > 0) return { background: '#f0fdf4', color: '#16a34a' }
    if (count < 0) return { background: '#fef2f2', color: '#dc2626' }
    return { background: '#f9fafb', color: '#6b7280' }
  }

  const getStatusText = () => {
    if (count > 0) return '正数'
    if (count < 0) return '负数'
    return '零'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #eff6ff 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* 头部 */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #16a34a, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🔢 计数器
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
            使用 Zustand 状态管理的计数器示例
          </p>
        </div>

        {/* 计数器显示 */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
          padding: '3rem',
          borderRadius: '24px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: '5rem',
            fontWeight: '900',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            {count}
          </div>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>当前计数</p>
          <div style={{
            ...getStatusColor(),
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            {getStatusText()}
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#1f2937'
          }}>
            🎮 操作面板
          </h2>

          {/* 基本操作 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={decrement}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ➖ 减少
            </button>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🔄 重置
            </button>
            <button
              onClick={increment}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ➕ 增加
            </button>
          </div>

          {/* 批量操作 */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
              批量操作
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[5, 10].map(num => (
                <React.Fragment key={num}>
                  <button
                    onClick={() => incrementBy(num)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    +{num}
                  </button>
                  <button
                    onClick={() => decrementBy(num)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    -{num}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* 状态信息 */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#1f2937'
          }}>
            📊 状态信息
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>
                {count}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>当前值</div>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                ...getStatusColor()
              }}>
                {getStatusText()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>状态</div>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: count >= -10 && count <= 10 ? '#10b981' : '#dc2626'
              }}>
                {count >= -10 && count <= 10 ? '✓' : '⚠️'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>范围状态</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CounterPage
