// 工作流组件展示页面

import React, { useState } from 'react'
import {
  StepWizard,
  StepNavigator,
  ApprovalPanel,
  ProcessFlow,
  Timeline,
  StatusIndicator,
  WorkflowStatusIndicator,
  StepStatusIndicator,
  FlowCanvas,
  type WizardStepConfig,
  type TimelineItem,
  type FlowNode,
  type FlowEdge
} from '../../components/workflow'
import { Form, FormItem, Input, CheckboxGroup } from '../../components/form'
import { useStepWizard } from '../../components/workflow'
import { useFormStore } from '../../stores/formStore'

// 步骤组件定义
const WizardStep1: React.FC = () => {
  const { updateData } = useStepWizard()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">个人信息</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            姓名 *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入姓名"
            onChange={(e) => updateData('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            邮箱 *
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入邮箱地址"
            onChange={(e) => updateData('email', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手机号 *
          </label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入手机号"
            onChange={(e) => updateData('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

const WizardStep2: React.FC = () => {
  const { updateData } = useStepWizard()

  const handleInterestChange = (value: string, checked: boolean) => {
    // 这里简化处理，实际应该从context获取当前值
    const currentInterests: string[] = []
    const newInterests = checked
      ? [...currentInterests, value]
      : currentInterests.filter((i: string) => i !== value)
    updateData('interests', newInterests)
  }

  const handleNotificationChange = (value: string, checked: boolean) => {
    // 这里简化处理，实际应该从context获取当前值
    const currentNotifications: string[] = ['email', 'sms']
    const newNotifications = checked
      ? [...currentNotifications, value]
      : currentNotifications.filter((n: string) => n !== value)
    updateData('notifications', newNotifications)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">偏好设置</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            兴趣爱好 * (可多选)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: 'reading', label: '阅读' },
              { value: 'sports', label: '运动' },
              { value: 'music', label: '音乐' },
              { value: 'travel', label: '旅行' },
              { value: 'cooking', label: '烹饪' },
              { value: 'photography', label: '摄影' }
            ].map((interest) => (
              <label key={interest.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => handleInterestChange(interest.value, e.target.checked)}
                />
                <span className="text-sm">{interest.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            通知设置
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300"
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
              />
              <span className="text-sm">邮件通知</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300"
                onChange={(e) => handleNotificationChange('sms', e.target.checked)}
              />
              <span className="text-sm">短信通知</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const WizardStep3: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">确认信息</h3>
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">请确认您填写的信息：</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <p>✅ 个人信息已填写</p>
          <p>✅ 偏好设置已配置</p>
          <p>✅ 表单验证通过</p>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            点击"完成"按钮提交表单，所有信息将被保存。
          </p>
        </div>
      </div>
    </div>
  )
}

const WorkflowPage: React.FC = () => {
  const formStore = useFormStore()
  const [activeTab, setActiveTab] = useState<'wizard' | 'approval' | 'visualization'>('wizard')

  // 多步骤表单示例配置
  const wizardSteps: WizardStepConfig[] = [
    {
      id: 'personal-info',
      title: '个人信息',
      description: '填写基本信息',
      fields: ['name', 'email', 'phone'],
      validation: {
        fields: {
          name: [{ required: true, message: '请输入姓名' }],
          email: [{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址' }],
          phone: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]
        }
      }
    },
    {
      id: 'preferences',
      title: '偏好设置',
      description: '选择您的偏好',
      fields: ['interests', 'notifications'],
      validation: {
        fields: {
          interests: [{ required: true, message: '请选择至少一个兴趣' }]
        }
      }
    },
    {
      id: 'confirmation',
      title: '确认信息',
      description: '确认并提交',
      fields: []
    }
  ]

  // 处理表单提交
  const handleWizardComplete = (data: Record<string, any>) => {
    console.log('多步骤表单完成:', data)
    formStore.addSubmission('多步骤表单', data, 'success')
    alert('表单提交成功！')
  }

  // 模拟审批流程
  const handleApproval = (approved: boolean, comment?: string) => {
    const formId = 'demo-approval-form'
    if (approved) {
      formStore.updateApprovalStatus(formId, 'approved')
      alert('审批通过！')
    } else {
      formStore.updateApprovalStatus(formId, 'rejected')
      alert('审批拒绝！')
    }
  }

  // 模拟时间线数据
  const timelineItems: TimelineItem[] = [
    {
      id: '1',
      title: '表单创建',
      description: '用户创建了新的表单',
      timestamp: Date.now() - 3600000,
      type: 'info',
      user: '系统'
    },
    {
      id: '2',
      title: '表单提交',
      description: '表单已提交等待审批',
      timestamp: Date.now() - 1800000,
      type: 'success',
      user: '张三'
    },
    {
      id: '3',
      title: '审批通过',
      description: '表单审批已通过',
      timestamp: Date.now() - 600000,
      type: 'success',
      user: '李四',
      metadata: { 审批意见: '内容完整，符合要求' }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚙️ 工作流组件展示
            </h1>
            <p className="text-lg text-gray-600">
              展示各种流程相关组件的使用示例和功能演示
            </p>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: 'wizard', label: '多步骤向导', icon: '📋' },
              { key: 'approval', label: '审批流程', icon: '✅' },
              { key: 'visualization', label: '流程可视化', icon: '📊' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 多步骤向导标签页 */}
        {activeTab === 'wizard' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  📋 多步骤表单向导
                </h2>
                <p className="text-gray-600">
                  演示多步骤表单的完整流程，包括步骤导航、验证和数据管理
                </p>
              </div>

              <StepWizard
                steps={wizardSteps}
                onComplete={handleWizardComplete}
                className="max-w-4xl mx-auto"
              >
                {/* 步骤1: 个人信息 */}
                <WizardStep1 />

                {/* 步骤2: 偏好设置 */}
                <WizardStep2 />

                {/* 步骤3: 确认信息 */}
                <WizardStep3 />
              </StepWizard>
            </div>
          </div>
        )}

        {/* 审批流程标签页 */}
        {activeTab === 'approval' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 审批面板 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ✅ 审批操作面板
                </h3>
                <ApprovalPanel
                  formId="demo-approval-form"
                  onApproval={handleApproval}
                  onReject={handleApproval}
                />
              </div>

              {/* 流程图 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 流程状态图
                </h3>
                <ProcessFlow
                  workflowState={formStore.getWorkflowState('demo-approval-form') || undefined}
                  showLegend={true}
                />
              </div>
            </div>

            {/* 审批历史时间线 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📅 审批历史记录
              </h3>
              <Timeline items={timelineItems} />
            </div>
          </div>
        )}

        {/* 流程可视化标签页 */}
        {activeTab === 'visualization' && (
          <div className="space-y-8">
            {/* React Flow 可编辑流程画布 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    🎨 React Flow 可编辑流程画布
                  </h3>
                  <p className="text-gray-600 mt-1">
                    支持拖拽添加节点、右键删除、连线编辑的完整流程图编辑器
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-green-600 font-medium">编辑模式已启用</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">实时编辑</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <FlowCanvas
                  editable={true}
                  showNodePanel={true}
                  showContextMenu={true}
                  height={500}
                  showMiniMap={true}
                  showControls={true}
                  interactive={true}
                  draggable={true}
                  zoomable={true}
                  pannable={true}
                  onNodeClick={(node) => {
                    console.log('点击节点:', node)
                  }}
                  onEdgeClick={(edge) => {
                    console.log('点击边:', edge)
                  }}
                  onNodeAdd={(node) => {
                    console.log('添加节点:', node)
                  }}
                  onNodeDelete={(nodeId) => {
                    console.log('删除节点:', nodeId)
                  }}
                  onEdgeDelete={(edgeId) => {
                    console.log('删除连线:', edgeId)
                  }}
                  onDataChange={(nodes, edges) => {
                    console.log('数据变化:', { nodes, edges })
                  }}
                />
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900 mb-2">🎯 编辑功能：</p>
                    <ul className="space-y-1">
                      <li>• 拖拽左侧面板节点到画布添加</li>
                      <li>• 右键节点/连线显示操作菜单</li>
                      <li>• 拖拽节点调整位置</li>
                      <li>• 点击节点间的连接点建立连线</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-2">🛠️ 操作提示：</p>
                    <ul className="space-y-1">
                      <li>• 鼠标滚轮缩放画布</li>
                      <li>• 右键空白区域显示视图菜单</li>
                      <li>• 右下角控制面板调整视图</li>
                      <li>• 右上角缩略图快速定位</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 传统流程图对比 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 传统流程图 (SVG实现)
              </h3>
              <p className="text-gray-600 mb-6">
                原有的ProcessFlow组件，基于SVG的静态流程图展示
              </p>

              <ProcessFlow
                workflowState={formStore.getWorkflowState('demo-approval-form') || undefined}
                showLegend={true}
              />
            </div>

            {/* 状态指示器展示 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                📊 状态指示器组件
              </h3>

              <div className="space-y-8">
                {/* 工作流状态指示器 */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">工作流状态</h4>
                  <div className="flex flex-wrap gap-4">
                    <WorkflowStatusIndicator status="draft" />
                    <WorkflowStatusIndicator status="submitted" animated />
                    <WorkflowStatusIndicator status="approved" />
                    <WorkflowStatusIndicator status="rejected" />
                  </div>
                </div>

                {/* 步骤状态指示器 */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">步骤状态</h4>
                  <div className="flex flex-wrap gap-4">
                    <StepStatusIndicator status="pending" />
                    <StepStatusIndicator status="active" animated />
                    <StepStatusIndicator status="completed" />
                    <StepStatusIndicator status="error" />
                  </div>
                </div>

                {/* 通用状态指示器 */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">通用状态</h4>
                  <div className="flex flex-wrap gap-4">
                    <StatusIndicator status="success" showText />
                    <StatusIndicator status="warning" showText />
                    <StatusIndicator status="error" showText />
                    <StatusIndicator status="info" showText />
                    <StatusIndicator status="pending" showText />
                    <StatusIndicator status="active" showText animated />
                  </div>
                </div>

                {/* 不同尺寸 */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">不同尺寸</h4>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <StatusIndicator status="success" size="sm" />
                      <p className="text-xs text-gray-500 mt-1">小尺寸</p>
                    </div>
                    <div className="text-center">
                      <StatusIndicator status="success" size="md" />
                      <p className="text-xs text-gray-500 mt-1">中等尺寸</p>
                    </div>
                    <div className="text-center">
                      <StatusIndicator status="success" size="lg" />
                      <p className="text-xs text-gray-500 mt-1">大尺寸</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 步骤导航器示例 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🧭 步骤导航器
              </h3>
              <div className="max-w-2xl">
                <StepNavigator
                  steps={[
                    { id: 'step1', title: '第一步', description: '开始设置' },
                    { id: 'step2', title: '第二步', description: '配置选项' },
                    { id: 'step3', title: '第三步', description: '确认提交' }
                  ]}
                  currentStep={1}
                  showProgressBar={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* 组件特性说明 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 工作流组件库特性
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-medium text-gray-900 mb-1">多步骤向导</h4>
              <p className="text-sm text-gray-600">支持复杂的多步骤表单流程</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-medium text-gray-900 mb-1">审批流程</h4>
              <p className="text-sm text-gray-600">完整的审批工作流管理</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-900 mb-1">流程可视化</h4>
              <p className="text-sm text-gray-600">直观的流程状态展示</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-medium text-gray-900 mb-1">Tailwind样式</h4>
              <p className="text-sm text-gray-600">基于Tailwind CSS设计</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowPage
