import React from 'react'
import { Panel } from 'reactflow'
import { clsx } from 'clsx'

// 节点类型定义
export interface NodeType {
  type: 'workflowNode' | 'decisionNode' | 'startNode' | 'endNode'
  label: string
  icon: string
  description: string
}

// 预定义的节点类型
const nodeTypes: NodeType[] = [
  {
    type: 'startNode',
    label: '开始节点',
    icon: '▶️',
    description: '流程开始'
  },
  {
    type: 'workflowNode',
    label: '处理节点',
    icon: '📋',
    description: '流程处理步骤'
  },
  {
    type: 'decisionNode',
    label: '决策节点',
    icon: '❓',
    description: '条件判断'
  },
  {
    type: 'endNode',
    label: '结束节点',
    icon: '⏹️',
    description: '流程结束'
  }
]

// 节点面板属性接口
export interface NodePanelProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  onNodeDragStart?: (nodeType: string) => void
  className?: string
}

const NodePanel: React.FC<NodePanelProps> = ({
  position = 'top-left',
  onNodeDragStart,
  className = ''
}) => {
  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    // 设置拖拽数据
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'

    // 触发回调
    onNodeDragStart?.(nodeType)
  }

  return (
    <Panel position={position} className={className}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-48">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🎨</span>
          节点面板
        </h3>

        <div className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(event) => handleDragStart(event, nodeType.type)}
              className={clsx(
                'flex items-center space-x-3 p-3 rounded-md border border-gray-200 cursor-move transition-all',
                'hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm',
                'active:scale-95'
              )}
              title={nodeType.description}
            >
              {/* 图标 */}
              <span className="text-lg">{nodeType.icon}</span>

              {/* 节点信息 */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {nodeType.label}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {nodeType.description}
                </div>
              </div>

              {/* 拖拽提示 */}
              <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                拖拽添加
              </div>
            </div>
          ))}
        </div>

        {/* 使用提示 */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            拖拽节点到画布中添加
          </p>
        </div>
      </div>
    </Panel>
  )
}

export default NodePanel
