// 步骤导航组件
export { default as StepNavigator } from './StepNavigator'
export type { StepConfig, StepStatus, StepNavigatorProps } from './StepNavigator'

// 步骤向导组件
export { default as StepWizard, useStepWizard } from './StepWizard'
export type {
  WizardStepConfig,
  StepComponentProps,
  StepWizardProps,
  StepValidation
} from './StepWizard'

// 审批面板组件
export { default as ApprovalPanel } from './ApprovalPanel'
export type { ApprovalPanelProps } from './ApprovalPanel'

// 流程图组件
export { default as ProcessFlow } from './ProcessFlow'
export type {
  ProcessNode,
  ProcessEdge,
  ProcessFlowProps
} from './ProcessFlow'

// React Flow 流程画布组件
export { default as FlowCanvas } from './FlowCanvas'
export type {
  FlowCanvasProps,
  FlowNode,
  FlowEdge
} from './FlowCanvas'

// 节点面板组件
export { default as NodePanel } from './NodePanel'
export type { NodePanelProps, NodeType } from './NodePanel'

// 右键菜单组件
export { default as ContextMenu } from './ContextMenu'
export type { ContextMenuProps, MenuItem } from './ContextMenu'

// 时间线组件
export { default as Timeline, ApprovalTimeline } from './Timeline'
export type {
  TimelineItem,
  TimelineProps,
  ApprovalTimelineProps
} from './Timeline'

// 状态指示器组件
export {
  default as StatusIndicator,
  WorkflowStatusIndicator,
  StepStatusIndicator,
  StatusIndicatorGroup
} from './StatusIndicator'
export type {
  StatusType,
  StatusIndicatorProps,
  WorkflowStatusIndicatorProps,
  StepStatusIndicatorProps,
  StatusIndicatorGroupProps
} from './StatusIndicator'

// 重新导出表单store中的工作流相关类型
export type {
  FormWorkflowState,
  ApprovalRecord
} from '../../stores/formStore'
