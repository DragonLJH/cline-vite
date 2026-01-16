import React, { useState, useCallback, useMemo, createContext, useContext } from 'react'
import { clsx } from 'clsx'
import StepNavigator, { StepConfig, StepStatus } from './StepNavigator'
import { ValidationRule, ValidationResult, validateForm, isFormValid } from '../form/validation'

// 步骤验证配置接口
export interface StepValidation {
  // 步骤内字段验证规则
  fields?: Record<string, ValidationRule[]>
  // 跨步骤验证函数
  crossStepValidation?: (allData: Record<string, any>) => ValidationResult
  // 是否可以跳过此步骤
  canSkip?: boolean
}

// 扩展的步骤配置
export interface WizardStepConfig extends StepConfig {
  // 该步骤包含的字段
  fields: string[]
  // 验证配置
  validation?: StepValidation
  // 步骤组件
  component?: React.ComponentType<StepComponentProps>
}

// 步骤组件属性接口
export interface StepComponentProps {
  stepData: Record<string, any>
  allData: Record<string, any>
  onChange: (field: string, value: any) => void
  onNext?: () => void
  onPrev?: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

// 步骤向导上下文接口
interface StepWizardContextValue {
  // 当前步骤
  currentStep: number
  // 总步骤数
  totalSteps: number
  // 步骤配置
  steps: WizardStepConfig[]
  // 表单数据
  data: Record<string, any>
  // 步骤状态
  stepStatuses: StepStatus[]
  // 操作方法
  goToStep: (stepIndex: number) => void
  goToNext: () => void
  goToPrev: () => void
  updateData: (field: string, value: any) => void
  updateStepData: (stepIndex: number, stepData: Record<string, any>) => void
  validateCurrentStep: () => boolean
  validateAllSteps: () => boolean
  isCompleted: boolean
  canGoNext: boolean
  canGoPrev: boolean
}

// 步骤向导上下文
const StepWizardContext = createContext<StepWizardContextValue | null>(null)

// Hook 用于在子组件中访问步骤向导上下文
export const useStepWizard = (): StepWizardContextValue => {
  const context = useContext(StepWizardContext)
  if (!context) {
    throw new Error('useStepWizard must be used within a StepWizard component')
  }
  return context
}

// 为了向后兼容，保留原名
export const useStepWizardContext = useStepWizard

// 步骤向导属性接口
export interface StepWizardProps {
  steps: WizardStepConfig[]
  initialData?: Record<string, any>
  onComplete?: (data: Record<string, any>) => void | Promise<void>
  onStepChange?: (stepIndex: number, data: Record<string, any>) => void
  onDataChange?: (data: Record<string, any>) => void
  allowNavigation?: boolean
  showNavigator?: boolean
  className?: string
  children?: React.ReactNode
}

const StepWizard: React.FC<StepWizardProps> = ({
  steps,
  initialData = {},
  onComplete,
  onStepChange,
  onDataChange,
  allowNavigation = true,
  showNavigator = true,
  className = '',
  children
}) => {
  // 当前步骤索引
  const [currentStep, setCurrentStep] = useState(0)

  // 表单数据
  const [data, setData] = useState<Record<string, any>>(initialData)

  // 步骤状态
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    steps.map((_, index) => index === 0 ? 'active' : 'pending')
  )

  // 更新表单数据
  const updateData = useCallback((field: string, value: any) => {
    setData(prev => {
      const newData = { ...prev, [field]: value }
      onDataChange?.(newData)
      return newData
    })
  }, [onDataChange])

  // 更新步骤数据
  const updateStepData = useCallback((stepIndex: number, stepData: Record<string, any>) => {
    const stepFields = steps[stepIndex]?.fields || []
    setData(prev => {
      const newData = { ...prev }
      stepFields.forEach(field => {
        if (field in stepData) {
          newData[field] = stepData[field]
        }
      })
      onDataChange?.(newData)
      return newData
    })
  }, [steps, onDataChange])

  // 纯验证函数，不涉及状态更新
  const validateStepData = useCallback((
    stepData: Record<string, any>,
    validation: StepValidation | undefined,
    allData: Record<string, any>
  ): boolean => {
    if (!validation) return true

    const { fields, crossStepValidation } = validation
    let isValid = true

    // 验证步骤内字段
    if (fields) {
      const fieldErrors = validateForm(stepData, fields)
      if (!isFormValid(fieldErrors)) {
        isValid = false
      }
    }

    // 验证跨步骤规则
    if (crossStepValidation) {
      const crossStepResult = crossStepValidation(allData)
      if (!crossStepResult.isValid) {
        isValid = false
      }
    }

    return isValid
  }, [])

  // 验证当前步骤（不直接更新状态）
  const validateCurrentStep = useCallback((): boolean => {
    const step = steps[currentStep]
    const stepFields = step?.fields || []
    const stepData = Object.fromEntries(
      Object.entries(data).filter(([key]) => stepFields.includes(key))
    )

    return validateStepData(stepData, step?.validation, data)
  }, [steps, currentStep, data, validateStepData])

  // 验证所有步骤
  const validateAllSteps = useCallback((): boolean => {
    let allValid = true

    steps.forEach((step, index) => {
      if (!step?.validation) return

      const { fields, crossStepValidation } = step.validation

      // 验证步骤内字段
      if (fields) {
        const stepData = Object.fromEntries(
          Object.entries(data).filter(([key]) => step.fields.includes(key))
        )
        const fieldErrors = validateForm(stepData, fields)
        if (!isFormValid(fieldErrors)) {
          allValid = false
        }
      }

      // 验证跨步骤规则
      if (crossStepValidation) {
        const crossStepResult = crossStepValidation(data)
        if (!crossStepResult.isValid) {
          allValid = false
        }
      }
    })

    return allValid
  }, [steps, data])

  // 跳转到指定步骤
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return

    // 验证当前步骤（如果前进到后面的步骤）
    if (stepIndex > currentStep && !validateCurrentStep()) {
      return
    }

    setCurrentStep(stepIndex)
    onStepChange?.(stepIndex, data)
  }, [steps.length, currentStep, validateCurrentStep, data, onStepChange])

  // 当步骤变化时，更新步骤状态
  React.useEffect(() => {
    setStepStatuses(prev => {
      const newStatuses = [...prev]
      // 更新状态：之前的步骤标记为完成，当前步骤为激活，后面的为待处理
      for (let i = 0; i < steps.length; i++) {
        if (i < currentStep) {
          newStatuses[i] = 'completed'
        } else if (i === currentStep) {
          newStatuses[i] = 'active'
        } else {
          newStatuses[i] = 'pending'
        }
      }
      return newStatuses
    })
  }, [currentStep, steps.length])

  // 下一歩
  const goToNext = useCallback(async () => {
    if (!validateCurrentStep()) return

    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1)
    } else {
      // 最后一步，完成流程
      if (validateAllSteps()) {
        await onComplete?.(data)
      }
    }
  }, [currentStep, steps.length, validateCurrentStep, validateAllSteps, goToStep, data, onComplete])

  // 上一歩
  const goToPrev = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])

  // 计算状态
  const isCompleted = currentStep === steps.length - 1 && stepStatuses[currentStep] === 'completed'
  const canGoNext = currentStep < steps.length - 1 || (currentStep === steps.length - 1 && validateCurrentStep())
  const canGoPrev = currentStep > 0

  // 当前步骤数据
  const currentStepData = useMemo(() => {
    const stepFields = steps[currentStep]?.fields || []
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => stepFields.includes(key))
    )
  }, [steps, currentStep, data])

  // 步骤导航配置
  const navigatorSteps = useMemo(() =>
    steps.map((step, index) => ({
      ...step,
      status: stepStatuses[index]
    })), [steps, stepStatuses]
  )

  // 上下文值
  const contextValue: StepWizardContextValue = {
    currentStep,
    totalSteps: steps.length,
    steps,
    data,
    stepStatuses,
    goToStep,
    goToNext,
    goToPrev,
    updateData,
    updateStepData,
    validateCurrentStep,
    validateAllSteps,
    isCompleted,
    canGoNext,
    canGoPrev
  }

  return (
    <StepWizardContext.Provider value={contextValue}>
      <div className={clsx('step-wizard', className)}>
        {/* 步骤导航 */}
        {showNavigator && (
          <StepNavigator
            steps={navigatorSteps}
            currentStep={currentStep}
            onStepChange={allowNavigation ? goToStep : undefined}
            className="mb-8"
          />
        )}

        {/* 步骤内容 */}
        <div className="step-content">
          {children ? (
            children
          ) : (
            (() => {
              const CurrentStepComponent = steps[currentStep]?.component
              return CurrentStepComponent ? (
                <CurrentStepComponent
                  stepData={currentStepData}
                  allData={data}
                  onChange={updateData}
                  onNext={canGoNext ? goToNext : undefined}
                  onPrev={canGoPrev ? goToPrev : undefined}
                  isFirstStep={currentStep === 0}
                  isLastStep={currentStep === steps.length - 1}
                />
              ) : null
            })()
          )}
        </div>

        {/* 默认导航按钮 */}
        {!children && (
          <div className="flex justify-between mt-8">
            <button
              onClick={goToPrev}
              disabled={!canGoPrev}
              className={clsx(
                'px-4 py-2 rounded-md transition-colors',
                canGoPrev
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              上一步
            </button>

            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className={clsx(
                'px-4 py-2 rounded-md transition-colors',
                canGoNext
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              {currentStep === steps.length - 1 ? '完成' : '下一步'}
            </button>
          </div>
        )}
      </div>
    </StepWizardContext.Provider>
  )
}

export default StepWizard
