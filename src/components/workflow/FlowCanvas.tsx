import React, { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow'
import 'reactflow/dist/style.css'

// 导入编辑组件
import NodePanel from './NodePanel'
import ContextMenu, { MenuItem } from './ContextMenu'

// React Flow节点接口
export interface FlowNode extends Node {
  type: 'workflowNode' | 'decisionNode' | 'startNode' | 'endNode'
  data: {
    label: string
    status: 'pending' | 'active' | 'completed' | 'error'
    description?: string
    icon?: string
  }
}

// React Flow边接口
export interface FlowEdge extends Omit<Edge, 'id' | 'source' | 'target' | 'type'> {
  id: string
  source: string
  target: string
  type: 'workflowEdge'
  data?: {
    condition?: string
    animated?: boolean
  }
}

// FlowCanvas组件属性接口
export interface FlowCanvasProps {
  initialNodes?: FlowNode[]
  initialEdges?: FlowEdge[]
  workflowState?: any // FormWorkflowState
  className?: string
  height?: number | string
  showMiniMap?: boolean
  showControls?: boolean
  interactive?: boolean
  draggable?: boolean
  zoomable?: boolean
  pannable?: boolean
  layout?: 'hierarchical' | 'force' | 'grid' | 'manual'
  direction?: 'TB' | 'BT' | 'LR' | 'RL'
  // 编辑功能相关属性
  editable?: boolean
  showNodePanel?: boolean
  showContextMenu?: boolean
  onNodeClick?: (node: FlowNode) => void
  onEdgeClick?: (edge: FlowEdge) => void
  onConnect?: (connection: Connection) => void
  onNodeAdd?: (node: FlowNode) => void
  onNodeDelete?: (nodeId: string) => void
  onEdgeDelete?: (edgeId: string) => void
  onDataChange?: (nodes: FlowNode[], edges: FlowEdge[]) => void
}

// 默认节点配置
const getDefaultNodes = (workflowState?: any): FlowNode[] => [
  {
    id: 'start',
    type: 'startNode',
    position: { x: 0, y: 0 },
    data: {
      label: '开始',
      status: 'completed',
      description: '表单创建',
      icon: '▶'
    },
  },
  {
    id: 'draft',
    type: 'workflowNode',
    position: { x: 0, y: 100 },
    data: {
      label: '草稿',
      status: workflowState?.approvalStatus === 'draft' ? 'active' : 'completed',
      description: '编辑表单内容',
    },
  },
  {
    id: 'submit',
    type: 'workflowNode',
    position: { x: 0, y: 200 },
    data: {
      label: '提交',
      status: workflowState?.approvalStatus === 'submitted' ? 'active' :
             ['approved', 'rejected'].includes(workflowState?.approvalStatus || '') ? 'completed' : 'pending',
      description: '提交表单审批',
    },
  },
  {
    id: 'review',
    type: 'decisionNode',
    position: { x: 0, y: 300 },
    data: {
      label: '审批',
      status: workflowState?.approvalStatus === 'submitted' ? 'active' :
             workflowState?.approvalStatus === 'approved' ? 'completed' :
             workflowState?.approvalStatus === 'rejected' ? 'error' : 'pending',
      description: '等待审批结果',
    },
  },
  {
    id: 'approved',
    type: 'endNode',
    position: { x: -100, y: 400 },
    data: {
      label: '通过',
      status: workflowState?.approvalStatus === 'approved' ? 'completed' : 'pending',
      description: '审批通过',
      icon: '✓'
    },
  },
  {
    id: 'rejected',
    type: 'endNode',
    position: { x: 100, y: 400 },
    data: {
      label: '拒绝',
      status: workflowState?.approvalStatus === 'rejected' ? 'completed' : 'pending',
      description: '审批拒绝',
      icon: '✕'
    },
  },
]

// 默认边配置
const getDefaultEdges = (): FlowEdge[] => [
  {
    id: 'start-draft',
    source: 'start',
    target: 'draft',
    type: 'workflowEdge',
    data: { animated: false }
  },
  {
    id: 'draft-submit',
    source: 'draft',
    target: 'submit',
    type: 'workflowEdge',
    data: { animated: false }
  },
  {
    id: 'submit-review',
    source: 'submit',
    target: 'review',
    type: 'workflowEdge',
    data: { animated: false }
  },
  {
    id: 'review-approved',
    source: 'review',
    target: 'approved',
    type: 'workflowEdge',
    data: {
      condition: 'approved',
      animated: false
    },
    label: '通过',
  },
  {
    id: 'review-rejected',
    source: 'review',
    target: 'rejected',
    type: 'workflowEdge',
    data: {
      condition: 'rejected',
      animated: false
    },
    label: '拒绝',
  },
]

// 内部FlowCanvas组件，处理React Flow逻辑
const FlowCanvasInner: React.FC<FlowCanvasProps> = ({
  initialNodes,
  initialEdges,
  workflowState,
  className = '',
  height = 600,
  showMiniMap = true,
  showControls = true,
  interactive = true,
  draggable = true,
  zoomable = true,
  pannable = true,
  layout = 'hierarchical',
  direction = 'TB',
  // 编辑功能相关属性
  editable = false,
  showNodePanel = false,
  showContextMenu = false,
  onNodeClick,
  onEdgeClick,
  onConnect,
  onNodeAdd,
  onNodeDelete,
  onEdgeDelete,
  onDataChange
}) => {
  const reactFlowInstance = useReactFlow()

  // 右键菜单状态
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number }
    items: MenuItem[]
  } | null>(null)

  // 使用最简单的默认节点，避免复杂的逻辑
  const defaultNodes = useMemo(() => {
    return initialNodes || [
      {
        id: '1',
        type: 'default',
        position: { x: 100, y: 100 },
        data: { label: '开始节点' },
      },
      {
        id: '2',
        type: 'default',
        position: { x: 300, y: 100 },
        data: { label: '处理节点' },
      },
    ]
  }, [initialNodes])

  const defaultEdges = useMemo(() =>
    initialEdges || [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
      },
    ],
    [initialEdges]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges)

  // 处理数据变化回调
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(nodes as FlowNode[], edges as FlowEdge[])
    }
  }, [nodes, edges, onDataChange])

  // 处理节点连接
  const onConnectCallback = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return

      const newEdge = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      }

      setEdges((eds) => addEdge(newEdge, eds))
      onConnect?.(params)
    },
    [setEdges, onConnect]
  )

  // 处理拖拽释放添加节点
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const nodeType = event.dataTransfer.getData('application/reactflow')

      if (!nodeType) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: FlowNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType as any,
        position,
        data: {
          label: `${nodeType}节点`,
          status: 'pending',
          description: '新添加的节点'
        },
      }

      setNodes((nds) => [...nds, newNode])
      onNodeAdd?.(newNode)
    },
    [reactFlowInstance, setNodes, onNodeAdd]
  )

  // 处理拖拽悬停
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // 处理右键菜单
  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()

      if (!showContextMenu) return

      setContextMenu({
        position: { x: event.clientX, y: event.clientY },
        items: [
          {
            id: 'fit-view',
            label: '适应视图',
            icon: '🔍',
            onClick: () => reactFlowInstance.fitView(),
          },
          {
            id: 'zoom-in',
            label: '放大',
            icon: '➕',
            onClick: () => reactFlowInstance.zoomIn(),
          },
          {
            id: 'zoom-out',
            label: '缩小',
            icon: '➖',
            onClick: () => reactFlowInstance.zoomOut(),
          },
        ],
      })
    },
    [showContextMenu, reactFlowInstance]
  )

  // 处理节点右键菜单
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault()

      if (!showContextMenu) return

      setContextMenu({
        position: { x: event.clientX, y: event.clientY },
        items: [
          {
            id: 'edit-node',
            label: '编辑节点',
            icon: '✏️',
            onClick: () => {
              // TODO: 实现节点编辑功能
              console.log('编辑节点:', node)
            },
          },
          {
            id: 'delete-node',
            label: '删除节点',
            icon: '🗑️',
            danger: true,
            onClick: () => {
              setNodes((nds) => nds.filter((n) => n.id !== node.id))
              setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))
              onNodeDelete?.(node.id)
            },
          },
        ],
      })
    },
    [showContextMenu, setNodes, setEdges, onNodeDelete]
  )

  // 处理连线右键菜单
  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault()

      if (!showContextMenu) return

      setContextMenu({
        position: { x: event.clientX, y: event.clientY },
        items: [
          {
            id: 'delete-edge',
            label: '删除连线',
            icon: '🗑️',
            danger: true,
            onClick: () => {
              setEdges((eds) => eds.filter((e) => e.id !== edge.id))
              onEdgeDelete?.(edge.id)
            },
          },
        ],
      })
    },
    [showContextMenu, setEdges, onEdgeDelete]
  )

  // 关闭右键菜单
  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  // 计算容器样式
  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div className={`flow-canvas ${className}`} style={containerStyle}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectCallback}
        onDrop={editable ? onDrop : undefined}
        onDragOver={editable ? onDragOver : undefined}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        fitView
        attributionPosition="bottom-left"
        // 交互配置
        nodesDraggable={draggable}
        nodesConnectable={interactive}
        elementsSelectable={interactive}
        zoomOnScroll={zoomable}
        panOnDrag={pannable}
        // 样式配置
        className="bg-gray-50"
      >
        {/* 背景网格 */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e7eb"
        />

        {/* 节点面板 */}
        {editable && showNodePanel && (
          <NodePanel
            position="top-left"
            onNodeDragStart={(nodeType) => console.log('开始拖拽节点:', nodeType)}
          />
        )}

        {/* 控制面板 */}
        {showControls && (
          <Controls
            position="bottom-right"
            className="bg-white border border-gray-200 rounded-lg shadow-lg"
          />
        )}

        {/* 缩略图 */}
        {showMiniMap && (
          <MiniMap
            position="bottom-left"
            className="bg-white border border-gray-200 rounded-lg shadow-lg"
          />
        )}

        {/* 顶部信息面板 */}
        <Panel position="top-center">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600">
            {editable ? 'React Flow 编辑模式' : 'React Flow 查看模式'}
          </div>
        </Panel>

        {/* 右键菜单 */}
        {contextMenu && (
          <ContextMenu
            position={contextMenu.position}
            items={contextMenu.items}
            onClose={closeContextMenu}
          />
        )}
      </ReactFlow>
    </div>
  )
}

// 主FlowCanvas组件，包装ReactFlowProvider
const FlowCanvas: React.FC<FlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}

export default FlowCanvas
