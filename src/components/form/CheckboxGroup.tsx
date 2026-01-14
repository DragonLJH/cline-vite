import React, { forwardRef } from 'react'

export interface CheckboxOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface CheckboxGroupProps {
  value: (string | number)[]
  onChange: (value: (string | number)[]) => void
  options: CheckboxOption[]
  name: string
  disabled?: boolean
  className?: string
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(({
  value,
  onChange,
  options,
  name,
  disabled = false,
  className = '',
  direction = 'vertical',
  size = 'md',
  ...props
}, ref) => {
  // 添加组件类型标识符
  const componentProps = {
    ...props,
    __isCheckboxGroup: true
  }
  // 尺寸样式
  const sizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  // 文字尺寸样式
  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  // 处理复选框状态变化
  const handleCheckboxChange = (optionValue: string | number, checked: boolean) => {
    if (checked) {
      // 添加到选中值
      onChange([...value, optionValue])
    } else {
      // 从选中值中移除
      onChange(value.filter(v => v !== optionValue))
    }
  }

  return (
    <div
      ref={ref}
      className={`
        ${direction === 'horizontal' ? 'flex gap-4' : 'space-y-2'}
        ${className}
      `.trim()}
      {...componentProps}
    >
      {options.map((option) => {
        const isChecked = value.includes(option.value)
        const isDisabled = option.disabled || disabled

        return (
          <label
            key={option.value}
            className={`
              inline-flex
              items-center
              cursor-pointer
              ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
              ${textSizeStyles[size]}
            `.trim()}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
              disabled={isDisabled}
              className={`
                appearance-none
                ${sizeStyles[size]}
                border
                border-gray-300
                rounded
                bg-white
                checked:bg-blue-500
                checked:border-blue-500
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:bg-gray-50
                transition-colors
                duration-200
                mr-2
                relative
                flex
                items-center
                justify-center
              `.trim()}
            />
            {/* 自定义复选框图标 */}
            {isChecked && (
              <svg
                className="absolute w-3 h-3 text-white pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className={`
              text-gray-900
              ${isDisabled ? 'text-gray-400' : ''}
            `.trim()}>
              {option.label}
            </span>
          </label>
        )
      })}
    </div>
  )
})

CheckboxGroup.displayName = 'CheckboxGroup'

export default CheckboxGroup