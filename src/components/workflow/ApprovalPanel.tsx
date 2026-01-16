import React, { useState } from 'react'
import { clsx } from 'clsx'
import { useFormStore, ApprovalRecord } from '../../stores/formStore'
import { PermissionService } from '../../services/permissionService'
import { useUserStore } from '../../stores/userStore'

// 审批面板属性接口
export interface ApprovalPanelProps {
  formId: string
  className?: string
  onApproval?: (approved: boolean, comment?: string) => void
  onReject?: (approved: boolean, comment?: string) => void
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({
  formId,
  className = '',
  onApproval,
  onReject
}) => {
  const { getWorkflowState, addApprovalRecord, updateApprovalStatus } = useFormStore()
  const { currentUser: user } = useUserStore()

  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const workflowState = getWorkflowState(formId)

  // 检查用户是否有审批权限
  const canApprove = PermissionService.hasPermission(user, 'form.approve')
  const canReject = PermissionService.hasPermission(user, 'form.reject')

  // 如果没有工作流状态，不显示审批面板
  if (!workflowState) {
    return null
  }

  // 处理审批操作
  const handleApproval = async (approved: boolean) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      // 检查权限
      if (approved && !canApprove) {
        throw new Error('没有审批权限')
      }
      if (!approved && !canReject) {
        throw new Error('没有拒绝权限')
      }

      // 获取当前用户信息（这里需要根据实际的用户系统调整）
      const currentUser = {
        id: 'current-user-id', // 实际应该从用户store获取
        name: '当前用户' // 实际应该从用户store获取
      }

      // 添加审批记录
      addApprovalRecord(formId, {
        approverId: currentUser.id,
        approverName: currentUser.name,
        action: approved ? 'approved' : 'rejected',
        comment: comment.trim() || undefined
      })

      // 更新审批状态
      updateApprovalStatus(formId, approved ? 'approved' : 'rejected')

      // 触发回调
      if (approved) {
        onApproval?.(true, comment.trim() || undefined)
      } else {
        onReject?.(false, comment.trim() || undefined)
      }

      // 清空评论
      setComment('')

    } catch (error) {
      console.error('审批操作失败:', error)
      alert(error instanceof Error ? error.message : '审批操作失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  return (
    <div className={clsx('approval-panel bg-white border rounded-lg p-6', className)}>
      {/* 审批状态 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">审批状态</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">当前状态:</span>
          <span className={clsx(
            'px-2 py-1 rounded-full text-sm font-medium',
            {
              'bg-yellow-100 text-yellow-800': workflowState.approvalStatus === 'draft',
              'bg-blue-100 text-blue-800': workflowState.approvalStatus === 'submitted',
              'bg-green-100 text-green-800': workflowState.approvalStatus === 'approved',
              'bg-red-100 text-red-800': workflowState.approvalStatus === 'rejected'
            }
          )}>
            {workflowState.approvalStatus === 'draft' && '草稿'}
            {workflowState.approvalStatus === 'submitted' && '待审批'}
            {workflowState.approvalStatus === 'approved' && '已通过'}
            {workflowState.approvalStatus === 'rejected' && '已拒绝'}
          </span>
        </div>
        {workflowState.submittedAt && (
          <div className="text-sm text-gray-500 mt-1">
            提交时间: {formatTime(workflowState.submittedAt)}
          </div>
        )}
        {workflowState.completedAt && (
          <div className="text-sm text-gray-500">
            完成时间: {formatTime(workflowState.completedAt)}
          </div>
        )}
      </div>

      {/* 审批操作 */}
      {workflowState.approvalStatus === 'submitted' && (canApprove || canReject) && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">审批操作</h4>

          {/* 评论输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              审批意见（可选）
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="请输入审批意见..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            {canApprove && (
              <button
                onClick={() => handleApproval(true)}
                disabled={isSubmitting}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors',
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                )}
              >
                {isSubmitting ? '处理中...' : '通过'}
              </button>
            )}

            {canReject && (
              <button
                onClick={() => handleApproval(false)}
                disabled={isSubmitting}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors',
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                )}
              >
                {isSubmitting ? '处理中...' : '拒绝'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 审批历史 */}
      {workflowState.approvalHistory.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">审批历史</h4>
          <div className="space-y-3">
            {workflowState.approvalHistory.map((record: ApprovalRecord) => (
              <div key={record.id} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{record.approverName}</span>
                  <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    record.action === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {record.action === 'approved' ? '通过' : '拒绝'}
                  </span>
                </div>
                {record.comment && (
                  <p className="text-sm text-gray-600 mb-2">{record.comment}</p>
                )}
                <div className="text-xs text-gray-500">
                  {formatTime(record.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 权限提示 */}
      {workflowState.approvalStatus === 'submitted' && !canApprove && !canReject && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                权限不足
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>您没有权限审批此表单。如需审批权限，请联系管理员。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApprovalPanel
