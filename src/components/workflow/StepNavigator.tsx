import React from 'react'
import { clsx } from 'clsx'

// 步骤状态枚举
export type StepStatus = 'pending' | 'active' | 'completed' | 'error'

// 步骤配置接口
export interface StepConfig {
  id: string
  title: string
  description?: string
  status?: StepStatus
  canSkip?: boolean
}

export interface StepNavigatorProps {
  steps: StepConfig[]
  currentStep: number
  onStepChange?: (stepIndex: number) => void
  className?: string
  showProgressBar?: boolean
  allowClickNavigation?: boolean
}

const StepNavigator: React.FC<StepNavigatorProps> = ({
  steps,
  currentStep,
  onStepChange,
  className = '',
  showProgressBar = true,
  allowClickNavigation = true
}) => {
  // 计算进度百分比
  const progress = ((currentStep + 1) / steps.length) * 100

  // 处理步骤点击
  const handleStepClick = (stepIndex: number) => {
    if (!allowClickNavigation) return

    const step = steps[stepIndex]
    // 只有已完成的步骤或当前步骤可以点击
    if (stepIndex <= currentStep || step.status === 'completed') {
      onStepChange?.(stepIndex)
    }
  }

  // 获取步骤状态
  const getStepStatus = (stepIndex: number): StepStatus => {
    const step = steps[stepIndex]

    if (step.status) return step.status
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'active'
    return 'pending'
  }

  // 获取步骤图标
  const getStepIcon = (status: StepStatus, stepIndex: number) => {
    switch (status) {
      case 'completed':
        return <span className="text-white text-sm">✓</span>
      case 'error':
        return <span className="text-white text-sm">✕</span>
      default:
        return <span className="text-gray-600 text-sm">{stepIndex + 1}</span>
    }
  }

  return (
    <div className={clsx('step-navigator', className)}>
      {/* 进度条 */}
      {showProgressBar && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>步骤进度</span>
            <span>{currentStep + 1} / {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 步骤导航 */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isClickable = allowClickNavigation &&
            (index <= currentStep || step.status === 'completed')

          return (
            <React.Fragment key={step.id}>
              {/* 步骤节点 */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={clsx(
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                    status === 'active' && 'bg-blue-600 border-blue-600 text-white',
                    status === 'completed' && 'bg-green-600 border-green-600 text-white',
                    status === 'error' && 'bg-red-600 border-red-600 text-white',
                    status === 'pending' && 'bg-white border-gray-300 text-gray-600',
                    isClickable && 'hover:border-blue-400 cursor-pointer',
                    !isClickable && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {getStepIcon(status, index)}
                </button>

                {/* 步骤标题 */}
                <div className="mt-2 text-center">
                  <div className={clsx(
                    'text-sm font-medium',
                    status === 'active' && 'text-blue-600',
                    status === 'completed' && 'text-green-600',
                    status === 'error' && 'text-red-600',
                    status === 'pending' && 'text-gray-500'
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1 max-w-20 truncate">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div className={clsx(
                  'flex-1 h-0.5 mx-2 transition-colors duration-200',
                  getStepStatus(index) === 'completed' && 'bg-green-600',
                  getStepStatus(index) === 'active' && 'bg-blue-600',
                  getStepStatus(index) === 'pending' && 'bg-gray-300'
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default StepNavigator
