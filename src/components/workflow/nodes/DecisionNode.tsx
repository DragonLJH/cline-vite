import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { clsx } from 'clsx'
import StatusIndicator from '../StatusIndicator'

// 决策节点组件（菱形）
const DecisionNode: React.FC<NodeProps> = ({
  data,
  selected,
  isConnectable
}) => {
  const { label, status = 'pending', description } = data

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
        return 'border-yellow-400 bg-yellow-50'
    }
  }

  return (
    <div
      className={clsx(
        'decision-node relative w-20 h-20 flex items-center justify-center transition-all duration-200',
        selected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      {/* 菱形背景 */}
      <div
        className={clsx(
          'absolute inset-0 border-2 rotate-45 flex items-center justify-center shadow-sm',
          getStatusStyles(),
          'hover:shadow-md'
        )}
      >
        {/* 决策图标 */}
        <span className="text-yellow-800 font-bold text-lg -rotate-45">?</span>
      </div>

      {/* 连接点 - 上下左右四个方向 */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-yellow-600 border border-white -translate-y-1"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-yellow-600 border border-white translate-y-1"
      />
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-yellow-600 border border-white -translate-x-1"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-yellow-600 border border-white translate-x-1"
      />

      {/* 节点信息（悬浮显示） */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
        <div className="font-medium">{label}</div>
        {description && <div className="text-gray-300">{description}</div>}
      </div>
    </div>
  )
}

export default DecisionNode
