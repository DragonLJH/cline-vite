import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserState {
  currentUser: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoggedIn: false,

      login: (user: User) => set({
        currentUser: user,
        isLoggedIn: true
      }),

      logout: () => set({
        currentUser: null,
        isLoggedIn: false
      }),

      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().currentUser
        if (currentUser) {
          set({
            currentUser: { ...currentUser, ...updates }
          })
        }
      }
    }),
    {
      name: 'user-storage',
      // 只持久化用户信息，不持久化登录状态
      partialize: (state) => ({
        currentUser: state.currentUser
      })
    }
  )
)
