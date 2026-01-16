import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { clsx } from 'clsx'

// 结束节点组件（圆形）
const EndNode: React.FC<NodeProps> = ({
  data,
  selected,
  isConnectable
}) => {
  const { label, status = 'pending', description, icon = '⏹️' } = data

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
        return 'border-red-400 bg-red-50'
    }
  }

  return (
    <div
      className={clsx(
        'end-node relative w-16 h-16 flex items-center justify-center transition-all duration-200',
        selected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      {/* 圆形背景 */}
      <div
        className={clsx(
          'w-full h-full rounded-full border-2 flex items-center justify-center shadow-sm',
          getStatusStyles(),
          'hover:shadow-md'
        )}
      >
        {/* 结束图标 */}
        <span className="text-red-800 font-bold text-lg">{icon}</span>
      </div>

      {/* 只输入连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-600 border-2 border-white"
      />

      {/* 节点信息（悬浮显示） */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
        <div className="font-medium">{label}</div>
        {description && <div className="text-gray-300">{description}</div>}
      </div>
    </div>
  )
}

export default EndNode
