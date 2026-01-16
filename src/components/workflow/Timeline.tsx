import React from 'react'
import { clsx } from 'clsx'
import { ApprovalRecord } from '../../stores/formStore'

// 时间线项目接口
export interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: number
  type: 'info' | 'success' | 'warning' | 'error'
  user?: string
  metadata?: Record<string, any>
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
  showConnector?: boolean
  compact?: boolean
  maxItems?: number
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  className = '',
  showConnector = true,
  compact = false,
  maxItems
}) => {
  // 按时间排序（最新的在前）
  const sortedItems = [...items]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, maxItems)

  // 获取时间线项目样式
  const getItemStyle = (type: TimelineItem['type']) => {
    const baseStyle = 'flex-shrink-0 w-3 h-3 rounded-full border-2'

    switch (type) {
      case 'success':
        return clsx(baseStyle, 'bg-green-600 border-green-600')
      case 'warning':
        return clsx(baseStyle, 'bg-yellow-600 border-yellow-600')
      case 'error':
        return clsx(baseStyle, 'bg-red-600 border-red-600')
      default:
        return clsx(baseStyle, 'bg-blue-600 border-blue-600')
    }
  }

  // 获取连接线样式
  const getConnectorStyle = (type: TimelineItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-600'
      case 'warning':
        return 'bg-yellow-600'
      case 'error':
        return 'bg-red-600'
      default:
        return 'bg-blue-600'
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else if (diffDays === 1) {
      return '昨天'
    } else if (diffDays < 7) {
      return `${diffDays}天前`
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  // 格式化完整时间
  const formatFullTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (sortedItems.length === 0) {
    return (
      <div className={clsx('timeline text-center py-8 text-gray-500', className)}>
        暂无时间线记录
      </div>
    )
  }

  return (
    <div className={clsx('timeline', className)}>
      <div className="flow-root">
        <ul className="-mb-8">
          {sortedItems.map((item, index) => (
            <li key={item.id}>
              <div className="relative pb-8">
                {showConnector && index < sortedItems.length - 1 && (
                  <span
                    className={clsx(
                      'absolute left-4 top-4 -ml-px h-full w-0.5',
                      getConnectorStyle(item.type)
                    )}
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex space-x-3">
                  {/* 时间线点 */}
                  <div>
                    <span className={getItemStyle(item.type)} />
                  </div>

                  {/* 内容区域 */}
                  <div className={clsx(
                    'flex-1 min-w-0',
                    compact ? 'pb-4' : 'pb-8'
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        {item.user && (
                          <span className="text-xs text-gray-500">
                            by {item.user}
                          </span>
                        )}
                      </div>
                      <div
                        className="text-xs text-gray-500 whitespace-nowrap"
                        title={formatFullTime(item.timestamp)}
                      >
                        {formatTime(item.timestamp)}
                      </div>
                    </div>

                    {item.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    )}

                    {/* 元数据 */}
                    {item.metadata && Object.keys(item.metadata).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {Object.entries(item.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// 审批历史时间线组件
export interface ApprovalTimelineProps {
  approvalHistory: ApprovalRecord[]
  className?: string
  compact?: boolean
  maxItems?: number
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({
  approvalHistory,
  className = '',
  compact = false,
  maxItems
}) => {
  // 转换审批记录为时间线项目
  const timelineItems: TimelineItem[] = approvalHistory.map(record => ({
    id: record.id,
    title: record.action === 'approved' ? '审批通过' : '审批拒绝',
    description: record.comment,
    timestamp: record.timestamp,
    type: record.action === 'approved' ? 'success' : 'error',
    user: record.approverName,
    metadata: {
      操作: record.action === 'approved' ? '通过' : '拒绝'
    }
  }))

  return (
    <Timeline
      items={timelineItems}
      className={className}
      compact={compact}
      maxItems={maxItems}
    />
  )
}

export default Timeline
