import React from 'react'
import { clsx } from 'clsx'

// 状态类型
export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending' | 'active' | 'completed'

export interface StatusIndicatorProps {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  text?: string
  className?: string
  animated?: boolean
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showText = false,
  text,
  className = '',
  animated = false
}) => {
  // 获取状态样式
  const getStatusStyle = () => {
    const baseClasses = 'inline-flex items-center rounded-full'

    switch (status) {
      case 'success':
        return clsx(baseClasses, 'bg-green-100 text-green-800')
      case 'error':
        return clsx(baseClasses, 'bg-red-100 text-red-800')
      case 'warning':
        return clsx(baseClasses, 'bg-yellow-100 text-yellow-800')
      case 'active':
        return clsx(baseClasses, 'bg-blue-100 text-blue-800')
      case 'pending':
        return clsx(baseClasses, 'bg-gray-100 text-gray-800')
      default:
        return clsx(baseClasses, 'bg-blue-100 text-blue-800')
    }
  }

  // 获取指示器样式
  const getIndicatorStyle = () => {
    const sizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    }

    const baseClasses = clsx(sizeClasses[size], 'rounded-full')

    switch (status) {
      case 'success':
        return clsx(baseClasses, 'bg-green-600')
      case 'error':
        return clsx(baseClasses, 'bg-red-600')
      case 'warning':
        return clsx(baseClasses, 'bg-yellow-600')
      case 'active':
        return clsx(
          baseClasses,
          'bg-blue-600',
          animated && 'animate-pulse'
        )
      case 'pending':
        return clsx(baseClasses, 'bg-gray-400')
      default:
        return clsx(baseClasses, 'bg-blue-600')
    }
  }

  // 获取默认文本
  const getDefaultText = () => {
    switch (status) {
      case 'success':
        return '成功'
      case 'error':
        return '错误'
      case 'warning':
        return '警告'
      case 'active':
        return '进行中'
      case 'pending':
        return '待处理'
      default:
        return '信息'
    }
  }

  const displayText = text || (showText ? getDefaultText() : '')

  return (
    <span className={clsx(getStatusStyle(), className)}>
      <span className={getIndicatorStyle()} />
      {displayText && (
        <span className="ml-2 text-sm font-medium">
          {displayText}
        </span>
      )}
    </span>
  )
}

// 工作流状态指示器
export interface WorkflowStatusIndicatorProps {
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
  animated?: boolean
}

export const WorkflowStatusIndicator: React.FC<WorkflowStatusIndicatorProps> = ({
  status,
  size = 'md',
  showText = true,
  className = '',
  animated = false
}) => {
  // 转换工作流状态为指示器状态
  const getIndicatorStatus = (): StatusType => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      case 'submitted':
        return 'active'
      case 'draft':
      default:
        return 'pending'
    }
  }

  // 获取状态文本
  const getStatusText = () => {
    switch (status) {
      case 'draft':
        return '草稿'
      case 'submitted':
        return '待审批'
      case 'approved':
        return '已通过'
      case 'rejected':
        return '已拒绝'
      default:
        return status
    }
  }

  return (
    <StatusIndicator
      status={getIndicatorStatus()}
      size={size}
      showText={showText}
      text={getStatusText()}
      className={className}
      animated={animated && status === 'submitted'}
    />
  )
}

// 步骤状态指示器
export interface StepStatusIndicatorProps {
  status: 'pending' | 'active' | 'completed' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
  animated?: boolean
}

export const StepStatusIndicator: React.FC<StepStatusIndicatorProps> = ({
  status,
  size = 'md',
  showText = true,
  className = '',
  animated = false
}) => {
  // 获取状态文本
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return '待处理'
      case 'active':
        return '进行中'
      case 'completed':
        return '已完成'
      case 'error':
        return '错误'
      default:
        return status
    }
  }

  return (
    <StatusIndicator
      status={status}
      size={size}
      showText={showText}
      text={getStatusText()}
      className={className}
      animated={animated && status === 'active'}
    />
  )
}

// 状态指示器组
export interface StatusIndicatorGroupProps {
  items: Array<{
    id: string
    status: StatusType
    label: string
  }>
  layout?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const StatusIndicatorGroup: React.FC<StatusIndicatorGroupProps> = ({
  items,
  layout = 'horizontal',
  size = 'md',
  className = ''
}) => {
  const layoutClasses = layout === 'horizontal'
    ? 'flex flex-wrap gap-3'
    : 'flex flex-col gap-2'

  return (
    <div className={clsx(layoutClasses, className)}>
      {items.map(item => (
        <div key={item.id} className="flex items-center space-x-2">
          <StatusIndicator
            status={item.status}
            size={size}
            showText={false}
          />
          <span className="text-sm text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default StatusIndicator
