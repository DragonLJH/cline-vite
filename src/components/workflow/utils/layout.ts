import dagre from 'dagre'
import { Node, Edge } from 'reactflow'

// 应用层次布局算法
export const applyHierarchicalLayout = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'BT' | 'LR' | 'RL' = 'TB'
): Node[] => {
  // 创建dagre图实例
  const dagreGraph = new dagre.graphlib.Graph()

  // 设置默认边标签
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  // 设置图的方向
  const isHorizontal = direction === 'LR' || direction === 'RL'
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: isHorizontal ? 80 : 50,  // 节点间距
    ranksep: isHorizontal ? 50 : 80,  // 层间距
    edgesep: 30,  // 边间距
    align: 'UL',  // 对齐方式
  })

  // 添加节点到dagre图
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width || 150,
      height: node.height || 50,
    })
  })

  // 添加边到dagre图
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // 计算布局
  dagre.layout(dagreGraph)

  // 应用计算后的位置到React Flow节点
  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (node.width || 150) / 2,
        y: nodeWithPosition.y - (node.height || 50) / 2,
      },
    }
  })
}

// 应用力导向布局算法（简化版本）
export const applyForceLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  // 这里可以集成d3-force或其他力导向布局库
  // 暂时返回原始节点
  console.warn('Force layout not implemented yet, returning original nodes')
  return nodes
}

// 应用网格布局
export const applyGridLayout = (
  nodes: Node[],
  cols: number = 3,
  nodeWidth: number = 200,
  nodeHeight: number = 100,
  spacing: number = 50
): Node[] => {
  return nodes.map((node, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols

    return {
      ...node,
      position: {
        x: col * (nodeWidth + spacing),
        y: row * (nodeHeight + spacing),
      },
    }
  })
}

// 获取节点中心点
export const getNodeCenter = (node: Node): { x: number; y: number } => {
  const width = node.width || 150
  const height = node.height || 50

  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  }
}

// 计算两点之间的距离
export const getDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number => {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}

// 自动调整画布大小以适应所有节点
export const fitViewToNodes = (nodes: Node[]): { x: number; y: number; zoom: number } => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, zoom: 1 }
  }

  // 计算边界
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach((node) => {
    const x = node.position.x
    const y = node.position.y
    const width = node.width || 150
    const height = node.height || 50

    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x + width)
    maxY = Math.max(maxY, y + height)
  })

  // 计算中心点
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  // 计算缩放比例（假设容器大小为800x600）
  const containerWidth = 800
  const containerHeight = 600
  const contentWidth = maxX - minX + 100 // 添加边距
  const contentHeight = maxY - minY + 100

  const scaleX = containerWidth / contentWidth
  const scaleY = containerHeight / contentHeight
  const zoom = Math.min(scaleX, scaleY, 1) // 不超过1倍放大

  return {
    x: centerX,
    y: centerY,
    zoom: Math.max(zoom, 0.1), // 最小缩放0.1
  }
}

// 检测节点是否重叠
export const detectOverlaps = (nodes: Node[]): boolean => {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const node1 = nodes[i]
      const node2 = nodes[j]

      const node1Right = node1.position.x + (node1.width || 150)
      const node1Bottom = node1.position.y + (node1.height || 50)
      const node2Right = node2.position.x + (node2.width || 150)
      const node2Bottom = node2.position.y + (node2.height || 50)

      // 检查是否重叠
      if (
        node1.position.x < node2Right &&
        node1Right > node2.position.x &&
        node1.position.y < node2Bottom &&
        node1Bottom > node2.position.y
      ) {
        return true
      }
    }
  }
  return false
}

// 获取连接两个节点的路径点（用于自定义连线）
export const getConnectionPath = (
  sourceNode: Node,
  targetNode: Node,
  offset: number = 20
): { sourceX: number; sourceY: number; targetX: number; targetY: number } => {
  const sourceCenter = getNodeCenter(sourceNode)
  const targetCenter = getNodeCenter(targetNode)

  // 计算方向向量
  const dx = targetCenter.x - sourceCenter.x
  const dy = targetCenter.y - sourceCenter.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance === 0) {
    return {
      sourceX: sourceCenter.x,
      sourceY: sourceCenter.y,
      targetX: targetCenter.x,
      targetY: targetCenter.y,
    }
  }

  // 计算单位向量
  const unitX = dx / distance
  const unitY = dy / distance

  return {
    sourceX: sourceCenter.x + unitX * offset,
    sourceY: sourceCenter.y + unitY * offset,
    targetX: targetCenter.x - unitX * offset,
    targetY: targetCenter.y - unitY * offset,
  }
}
