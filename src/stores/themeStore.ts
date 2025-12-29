import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeType = 'light' | 'dark'

interface ThemeState {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  toggleTheme: () => void
}

// 主题配置
export const themes = {
  light: {
    // 背景色
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--bg-tertiary': '#f1f5f9',
    '--bg-card': '#ffffff',
    '--bg-hover': '#f8fafc',

    // 文字颜色
    '--text-primary': '#1e293b',
    '--text-secondary': '#64748b',
    '--text-muted': '#94a3b8',
    '--text-inverse': '#ffffff',

    // 边框颜色
    '--border-primary': '#e2e8f0',
    '--border-secondary': '#cbd5e1',
    '--border-focus': '#3b82f6',

    // 按钮颜色
    '--btn-primary': '#3b82f6',
    '--btn-primary-hover': '#2563eb',
    '--btn-secondary': '#f1f5f9',
    '--btn-secondary-hover': '#e2e8f0',

    // 阴影
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',

    // 渐变
    '--gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  dark: {
    // 背景色
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--bg-tertiary': '#334155',
    '--bg-card': '#1e293b',
    '--bg-hover': '#334155',

    // 文字颜色
    '--text-primary': '#f8fafc',
    '--text-secondary': '#cbd5e1',
    '--text-muted': '#64748b',
    '--text-inverse': '#0f172a',

    // 边框颜色
    '--border-primary': '#334155',
    '--border-secondary': '#475569',
    '--border-focus': '#60a5fa',

    // 按钮颜色
    '--btn-primary': '#3b82f6',
    '--btn-primary-hover': '#60a5fa',
    '--btn-secondary': '#334155',
    '--btn-secondary-hover': '#475569',

    // 阴影
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.4)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.5)',

    // 渐变
    '--gradient-primary': 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    '--gradient-secondary': 'linear-gradient(135deg, #334155 0%, #475569 100%)',
  }
}

// 应用主题到DOM
const applyTheme = (theme: ThemeType) => {
  const root = document.documentElement
  const themeVars = themes[theme]

  Object.entries(themeVars).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })

  // 设置data-theme属性用于其他样式判断
  root.setAttribute('data-theme', theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',

      setTheme: (theme: ThemeType) => {
        set({ theme })
        applyTheme(theme)
      },

      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        applyTheme(newTheme)
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      }
    }
  )
)

// 初始化主题
if (typeof window !== 'undefined') {
  const theme = useThemeStore.getState().theme
  applyTheme(theme)
}
