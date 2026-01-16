import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FormSubmission {
  id: string
  formName: string
  data: Record<string, any>
  timestamp: number
  status: 'success' | 'error'
}

// 审批记录接口
export interface ApprovalRecord {
  id: string
  approverId: string
  approverName: string
  action: 'approved' | 'rejected'
  comment?: string
  timestamp: number
}

// 表单工作流状态接口
export interface FormWorkflowState {
  formId: string
  currentStep: number
  totalSteps: number
  isCompleted: boolean
  approvalStatus: 'draft' | 'submitted' | 'approved' | 'rejected'
  approvalHistory: ApprovalRecord[]
  submittedAt?: number
  completedAt?: number
}

interface FormState {
  submissions: Record<string, FormSubmission[]>
  // 工作流状态管理
  workflows: Record<string, FormWorkflowState>

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

  // 工作流相关方法
  // 初始化表单工作流
  initWorkflow: (formId: string, totalSteps: number) => void
  // 更新工作流步骤
  updateWorkflowStep: (formId: string, currentStep: number) => void
  // 提交表单进行审批
  submitForApproval: (formId: string, data: Record<string, any>) => void
  // 添加审批记录
  addApprovalRecord: (formId: string, record: Omit<ApprovalRecord, 'id' | 'timestamp'>) => void
  // 更新审批状态
  updateApprovalStatus: (formId: string, status: 'approved' | 'rejected') => void
  // 完成工作流
  completeWorkflow: (formId: string) => void
  // 获取工作流状态
  getWorkflowState: (formId: string) => FormWorkflowState | null
  // 获取所有工作流状态
  getAllWorkflowStates: () => Record<string, FormWorkflowState>
  // 清除工作流状态
  clearWorkflowState: (formId: string) => void
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      submissions: {},
      workflows: {},

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
      },

      // 工作流相关方法实现
      initWorkflow: (formId: string, totalSteps: number) => {
        const workflowState: FormWorkflowState = {
          formId,
          currentStep: 0,
          totalSteps,
          isCompleted: false,
          approvalStatus: 'draft',
          approvalHistory: []
        }

        set((state) => ({
          workflows: {
            ...state.workflows,
            [formId]: workflowState
          }
        }))

        console.log(`🔄 初始化表单工作流: ${formId}`, workflowState)
      },

      updateWorkflowStep: (formId: string, currentStep: number) => {
        set((state) => {
          const workflow = state.workflows[formId]
          if (!workflow) return state

          const updatedWorkflow: FormWorkflowState = {
            ...workflow,
            currentStep,
            isCompleted: currentStep >= workflow.totalSteps - 1
          }

          return {
            workflows: {
              ...state.workflows,
              [formId]: updatedWorkflow
            }
          }
        })

        console.log(`📍 更新工作流步骤: ${formId} -> ${currentStep}`)
      },

      submitForApproval: (formId: string, data: Record<string, any>) => {
        set((state) => {
          const workflow = state.workflows[formId]
          if (!workflow) return state

          const updatedWorkflow: FormWorkflowState = {
            ...workflow,
            approvalStatus: 'submitted',
            submittedAt: Date.now()
          }

          return {
            workflows: {
              ...state.workflows,
              [formId]: updatedWorkflow
            }
          }
        })

        // 添加提交记录
        get().addSubmission(formId, data, 'success')
        console.log(`📤 表单提交审批: ${formId}`)
      },

      addApprovalRecord: (formId: string, record: Omit<ApprovalRecord, 'id' | 'timestamp'>) => {
        const approvalRecord: ApprovalRecord = {
          ...record,
          id: `${formId}-approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now()
        }

        set((state) => {
          const workflow = state.workflows[formId]
          if (!workflow) return state

          const updatedWorkflow: FormWorkflowState = {
            ...workflow,
            approvalHistory: [...workflow.approvalHistory, approvalRecord]
          }

          return {
            workflows: {
              ...state.workflows,
              [formId]: updatedWorkflow
            }
          }
        })

        console.log(`✅ 添加审批记录: ${formId}`, approvalRecord)
      },

      updateApprovalStatus: (formId: string, status: 'approved' | 'rejected') => {
        set((state) => {
          const workflow = state.workflows[formId]
          if (!workflow) return state

          const updatedWorkflow: FormWorkflowState = {
            ...workflow,
            approvalStatus: status,
            isCompleted: status === 'approved',
            completedAt: status === 'approved' ? Date.now() : undefined
          }

          return {
            workflows: {
              ...state.workflows,
              [formId]: updatedWorkflow
            }
          }
        })

        console.log(`📊 更新审批状态: ${formId} -> ${status}`)
      },

      completeWorkflow: (formId: string) => {
        set((state) => {
          const workflow = state.workflows[formId]
          if (!workflow) return state

          const updatedWorkflow: FormWorkflowState = {
            ...workflow,
            isCompleted: true,
            completedAt: Date.now()
          }

          return {
            workflows: {
              ...state.workflows,
              [formId]: updatedWorkflow
            }
          }
        })

        console.log(`🏁 完成工作流: ${formId}`)
      },

      getWorkflowState: (formId: string) => {
        return get().workflows[formId] || null
      },

      getAllWorkflowStates: () => {
        return get().workflows
      },

      clearWorkflowState: (formId: string) => {
        set((state) => {
          const newWorkflows = { ...state.workflows }
          delete newWorkflows[formId]
          return { workflows: newWorkflows }
        })
        console.log(`🗑️ 已清除工作流状态: ${formId}`)
      }
    }),
    {
      name: 'form-storage',
      // 持久化提交数据和工作流状态
      partialize: (state) => ({ submissions: state.submissions, workflows: state.workflows })
    }
  )
)
