import React from 'react'
import { useFormContext } from './Form'

export interface FormItemProps {
  name: string
  label?: string
  required?: boolean
  help?: string
  className?: string
  labelClassName?: string
  errorClassName?: string
  helpClassName?: string
  children: React.ReactNode
}

const FormItem: React.FC<FormItemProps> = ({
  name,
  label,
  required = false,
  help,
  className = '',
  labelClassName = '',
  errorClassName = '',
  helpClassName = '',
  children
}) => {
  const formContext = useFormContext()
  const error = formContext.errors[name]?.message

  // 为子组件注入 value 和 onChange 属性
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // 根据组件类型处理不同的值格式
      let value = formContext.values[name]
      let onChange = (newValue: any) => formContext.setValue(name, newValue)

      // 根据组件类型处理不同的值格式
      if (child.props && child.props.__isCheckboxGroup) {
        // CheckboxGroup：值应该是数组
        if (!Array.isArray(value)) {
          value = value ? [value] : []
        }
      } else if (child.props && child.props.__isSwitch) {
        // Switch：值应该是boolean
        value = Boolean(value)
      } else {
        // 其他组件：确保值是字符串或适当的类型
        value = value || ''
      }

      return React.cloneElement(child, {
        ...child.props,
        name,
        value,
        onChange,
        onBlur: () => formContext.validateField(name),
        error: !!error,
        errorMessage: error
      })
    }
    return child
  })

  return (
    <div className={`space-y-1 ${className}`}>
      {/* 标签 */}
      {label && (
        <label
          htmlFor={name}
          className={`
            block
            text-sm
            font-medium
            text-gray-900
            ${labelClassName}
          `.trim()}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="必填">
              *
            </span>
          )}
        </label>
      )}

      {/* 表单控件 */}
      <div>
        {enhancedChildren}
      </div>

      {/* 帮助文本 */}
      {help && !error && (
        <p className={`
          text-sm
          text-gray-500
          ${helpClassName}
        `.trim()}>
          {help}
        </p>
      )}

      {/* 错误信息 */}
      {error && (
        <p className={`
          text-sm
          text-red-600
          flex
          items-center
          ${errorClassName}
        `.trim()}>
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormItem
