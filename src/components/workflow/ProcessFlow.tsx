import React from 'react'
import { clsx } from 'clsx'
import { FormWorkflowState } from '../../stores/formStore'

// 流程节点接口
export interface ProcessNode {
  id: string
  title: string
  description?: string
  status: 'pending' | 'active' | 'completed' | 'error'
  type: 'start' | 'process' | 'decision' | 'end'
  position?: { x: number; y: number }
}

// 流程边接口
export interface ProcessEdge {
  id: string
  source: string
  target: string
  label?: string
  condition?: string
}

export interface ProcessFlowProps {
  workflowState?: FormWorkflowState
  nodes?: ProcessNode[]
  edges?: ProcessEdge[]
  className?: string
  showLegend?: boolean
  interactive?: boolean
}

// 默认流程节点配置
const getDefaultNodes = (workflowState?: FormWorkflowState): ProcessNode[] => [
  {
    id: 'start',
    title: '开始',
    description: '表单创建',
    status: 'completed',
    type: 'start'
  },
  {
    id: 'draft',
    title: '草稿',
    description: '编辑表单内容',
    status: workflowState?.approvalStatus === 'draft' ? 'active' : 'completed',
    type: 'process'
  },
  {
    id: 'submit',
    title: '提交',
    description: '提交表单审批',
    status: workflowState?.approvalStatus === 'submitted' ? 'active' :
           ['approved', 'rejected'].includes(workflowState?.approvalStatus || '') ? 'completed' : 'pending',
    type: 'process'
  },
  {
    id: 'review',
    title: '审批',
    description: '等待审批结果',
    status: workflowState?.approvalStatus === 'submitted' ? 'active' :
           workflowState?.approvalStatus === 'approved' ? 'completed' :
           workflowState?.approvalStatus === 'rejected' ? 'error' : 'pending',
    type: 'decision'
  },
  {
    id: 'approved',
    title: '通过',
    description: '审批通过',
    status: workflowState?.approvalStatus === 'approved' ? 'completed' : 'pending',
    type: 'end'
  },
  {
    id: 'rejected',
    title: '拒绝',
    description: '审批拒绝',
    status: workflowState?.approvalStatus === 'rejected' ? 'completed' : 'pending',
    type: 'end'
  }
]

// 默认流程边配置
const getDefaultEdges = (): ProcessEdge[] => [
  { id: 'start-draft', source: 'start', target: 'draft' },
  { id: 'draft-submit', source: 'draft', target: 'submit' },
  { id: 'submit-review', source: 'submit', target: 'review' },
  { id: 'review-approved', source: 'review', target: 'approved', label: '通过', condition: 'approved' },
  { id: 'review-rejected', source: 'review', target: 'rejected', label: '拒绝', condition: 'rejected' }
]

const ProcessFlow: React.FC<ProcessFlowProps> = ({
  workflowState,
  nodes: customNodes,
  edges: customEdges,
  className = '',
  showLegend = true,
  interactive = false
}) => {
  const nodes = customNodes || getDefaultNodes(workflowState)
  const edges = customEdges || getDefaultEdges()

  // 获取节点样式
  const getNodeStyle = (node: ProcessNode) => {
    const baseStyle = 'w-16 h-16 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200'

    switch (node.type) {
      case 'start':
        return clsx(baseStyle, 'border-green-500 bg-green-50 text-green-700')
      case 'end':
        return clsx(baseStyle, 'border-red-500 bg-red-50 text-red-700')
      case 'decision':
        return clsx(baseStyle, 'border-yellow-500 bg-yellow-50 text-yellow-700 rotate-45')
      default:
        return clsx(baseStyle, 'border-blue-500 bg-blue-50 text-blue-700')
    }
  }

  // 获取状态样式
  const getStatusStyle = (status: ProcessNode['status']) => {
    switch (status) {
      case 'active':
        return 'ring-4 ring-blue-300 bg-blue-600 text-white border-blue-600'
      case 'completed':
        return 'bg-green-600 text-white border-green-600'
      case 'error':
        return 'bg-red-600 text-white border-red-600'
      default:
        return 'bg-gray-200 text-gray-600 border-gray-300'
    }
  }

  // 获取节点图标
  const getNodeIcon = (node: ProcessNode) => {
    switch (node.type) {
      case 'start':
        return '▶'
      case 'end':
        return node.id === 'approved' ? '✓' : '✕'
      case 'decision':
        return '?'
      default:
        return node.title.charAt(0)
    }
  }

  // 计算节点位置（简单的水平布局）
  const getNodePosition = (index: number, total: number, nodeType: ProcessNode['type']) => {
    const containerWidth = 600 // 假设容器宽度
    const spacing = containerWidth / (total + 1)
    return {
      left: `${spacing * (index + 1) - 32}px`, // 32px 是节点宽度的一半
      top: nodeType === 'decision' ? '60px' : '20px'
    }
  }

  return (
    <div className={clsx('process-flow', className)}>
      {/* 图例 */}
      {showLegend && (
        <div className="mb-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-gray-300"></div>
            <span>待处理</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-blue-600 ring-4 ring-blue-300"></div>
            <span>进行中</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-green-600"></div>
            <span>已完成</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-600"></div>
            <span>错误</span>
          </div>
        </div>
      )}

      {/* 流程图容器 */}
      <div className="relative bg-gray-50 rounded-lg p-8 min-h-48 overflow-x-auto">
        {/* 渲染边 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge) => {
            const sourceNode = nodes.find(n => n.id === edge.source)
            const targetNode = nodes.find(n => n.id === edge.target)
            if (!sourceNode || !targetNode) return null

            const sourceIndex = nodes.indexOf(sourceNode)
            const targetIndex = nodes.indexOf(targetNode)

            // 简单的水平连线
            const startX = (sourceIndex + 1) * (600 / (nodes.length + 1))
            const endX = (targetIndex + 1) * (600 / (nodes.length + 1))
            const startY = sourceNode.type === 'decision' ? 80 : 40
            const endY = targetNode.type === 'decision' ? 80 : 40

            return (
              <g key={edge.id}>
                {/* 连线 */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={sourceNode.status === 'completed' ? '#10B981' :
                          sourceNode.status === 'active' ? '#3B82F6' : '#D1D5DB'}
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                {/* 标签 */}
                {edge.label && (
                  <text
                    x={(startX + endX) / 2}
                    y={(startY + endY) / 2 - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            )
          })}
          {/* 箭头定义 */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#D1D5DB"
              />
            </marker>
          </defs>
        </svg>

        {/* 渲染节点 */}
        {nodes.map((node, index) => (
          <div
            key={node.id}
            className={clsx(
              'absolute flex flex-col items-center',
              interactive && 'cursor-pointer hover:scale-105 transition-transform'
            )}
            style={getNodePosition(index, nodes.length, node.type)}
          >
            {/* 节点 */}
            <div className={clsx(
              getNodeStyle(node),
              getStatusStyle(node.status),
              node.type === 'decision' && 'rotate-45'
            )}>
              {getNodeIcon(node)}
            </div>

            {/* 节点信息 */}
            <div className="mt-2 text-center max-w-20">
              <div className="text-sm font-medium text-gray-900 truncate">
                {node.title}
              </div>
              {node.description && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {node.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 工作流状态信息 */}
      {workflowState && (
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>当前步骤: {workflowState.currentStep + 1} / {workflowState.totalSteps}</span>
            <span>状态: {
              workflowState.approvalStatus === 'draft' ? '草稿' :
              workflowState.approvalStatus === 'submitted' ? '待审批' :
              workflowState.approvalStatus === 'approved' ? '已通过' :
              workflowState.approvalStatus === 'rejected' ? '已拒绝' : '未知'
            }</span>
          </div>
          {workflowState.submittedAt && (
            <div className="mt-1">
              提交时间: {new Date(workflowState.submittedAt).toLocaleString('zh-CN')}
            </div>
          )}
          {workflowState.completedAt && (
            <div className="mt-1">
              完成时间: {new Date(workflowState.completedAt).toLocaleString('zh-CN')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProcessFlow
