import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FormSubmission {
  id: string
  formName: string
  data: Record<string, any>
  timestamp: number
  status: 'success' | 'error'
}

interface FormState {
  submissions: Record<string, FormSubmission[]>
  // 添加表单提交
  addSubmission: (formName: string, data: Record<string, any>, status?: 'success' | 'error') => void
  // 获取表单提交历史
  getFormSubmissions: (formName: string) => FormSubmission[]
  // 获取所有提交历史
  getAllSubmissions: () => Record<string, FormSubmission[]>
  // 清除表单提交历史
  clearFormSubmissions: (formName: string) => void
  // 清除所有提交历史
  clearAllSubmissions: () => void
  // 删除单个提交
  removeSubmission: (formName: string, submissionId: string) => void
  // 获取最近的提交
  getRecentSubmissions: (limit?: number) => FormSubmission[]
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      submissions: {},

      addSubmission: (formName: string, data: Record<string, any>, status: 'success' | 'error' = 'success') => {
        const submission: FormSubmission = {
          id: `${formName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          formName,
          data: { ...data }, // 深拷贝数据
          timestamp: Date.now(),
          status
        }

        set((state) => ({
          submissions: {
            ...state.submissions,
            [formName]: [submission, ...(state.submissions[formName] || [])]
          }
        }))

        console.log(`📝 表单提交已存储: ${formName}`, submission)
      },

      getFormSubmissions: (formName: string) => {
        return get().submissions[formName] || []
      },

      getAllSubmissions: () => {
        return get().submissions
      },

      clearFormSubmissions: (formName: string) => {
        set((state) => {
          const newSubmissions = { ...state.submissions }
          delete newSubmissions[formName]
          return { submissions: newSubmissions }
        })
        console.log(`🗑️ 已清除表单历史: ${formName}`)
      },

      clearAllSubmissions: () => {
        set({ submissions: {} })
        console.log('🗑️ 已清除所有表单历史')
      },

      removeSubmission: (formName: string, submissionId: string) => {
        set((state) => {
          const formSubmissions = state.submissions[formName] || []
          const filteredSubmissions = formSubmissions.filter(sub => sub.id !== submissionId)

          return {
            submissions: {
              ...state.submissions,
              [formName]: filteredSubmissions
            }
          }
        })
        console.log(`🗑️ 已删除提交记录: ${formName} - ${submissionId}`)
      },

      getRecentSubmissions: (limit: number = 10) => {
        const allSubmissions: FormSubmission[] = []
        Object.values(get().submissions).forEach(formSubs => {
          allSubmissions.push(...formSubs)
        })

        return allSubmissions
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit)
      }
    }),
    {
      name: 'form-storage',
      // 只持久化提交数据，不持久化其他状态
      partialize: (state) => ({ submissions: state.submissions })
    }
  )
)