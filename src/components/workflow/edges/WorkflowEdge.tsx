import React from 'react'
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from 'reactflow'
import { clsx } from 'clsx'

// 工作流边组件
const WorkflowEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data
}) => {
  // 计算平滑步骤路径
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  // 获取边样式
  const getEdgeStyle = () => {
    const baseStyle = {
      strokeWidth: 2,
      stroke: '#d1d5db', // 默认灰色
      ...style
    }

    // 根据数据自定义样式
    if (data?.animated) {
      return {
        ...baseStyle,
        stroke: '#3b82f6', // 蓝色
        strokeDasharray: '5,5',
        animation: 'flow 2s linear infinite'
      }
    }

    return baseStyle
  }

  return (
    <>
      {/* 主边路径 */}
      <BaseEdge
        path={edgePath}
        style={getEdgeStyle()}
        markerEnd={markerEnd}
      />

      {/* 标签渲染器 */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '2px 6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            className={clsx(
              'nodrag nopan',
              'text-xs font-medium text-gray-700'
            )}
          >
            {label}

            {/* 条件标签样式 */}
            {data?.condition && (
              <span className="ml-1 text-blue-600 font-semibold">
                ({data.condition})
              </span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* CSS动画定义 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes flow {
            to {
              stroke-dashoffset: -10;
            }
          }
        `
      }} />
    </>
  )
}

export default WorkflowEdge
