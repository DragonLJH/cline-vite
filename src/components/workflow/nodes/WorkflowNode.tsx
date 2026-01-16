import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { clsx } from 'clsx'
import StatusIndicator from '../StatusIndicator'

// 工作流节点组件
const WorkflowNode: React.FC<NodeProps> = ({
  data,
  selected,
  isConnectable
}) => {
  const { label, status = 'pending', description, icon } = data

  // 获取状态样式
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'border-blue-500 bg-blue-50 ring-4 ring-blue-200'
      case 'completed':
        return 'border-green-500 bg-green-50'
      case 'error':
        return 'border-red-500 bg-red-50'
      case 'pending':
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  return (
    <div
      className={clsx(
        'workflow-node px-4 py-3 rounded-lg border-2 min-w-40 max-w-60 transition-all duration-200 shadow-sm',
        getStatusStyles(),
        selected && 'ring-2 ring-blue-500 ring-offset-2',
        'hover:shadow-md'
      )}
    >
      {/* 连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      {/* 节点内容 */}
      <div className="flex items-center justify-center space-x-3">
        {/* 状态指示器 */}
        <StatusIndicator
          status={status}
          size="sm"
          showText={false}
        />

        {/* 图标 */}
        {icon && (
          <span className="text-lg">{icon}</span>
        )}

        {/* 标题 */}
        <div className="flex-1 text-center">
          <div className="font-semibold text-gray-900 text-sm leading-tight">
            {label}
          </div>
          {description && (
            <div className="text-xs text-gray-600 mt-1 truncate">
              {description}
            </div>
          )}
        </div>
      </div>

      {/* 输出连接点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  )
}

export default WorkflowNode
