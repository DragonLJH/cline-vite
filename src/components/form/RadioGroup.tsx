import React, { forwardRef } from 'react'

export interface RadioOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  value: string | number
  onChange: (value: string | number) => void
  options: RadioOption[]
  name: string
  disabled?: boolean
  className?: string
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(({
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
    __isRadioGroup: true
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

  return (
    <div
      ref={ref}
      className={`
        ${direction === 'horizontal' ? 'flex gap-4' : 'space-y-2'}
        ${className}
      `.trim()}
      {...componentProps}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            inline-flex
            items-center
            cursor-pointer
            ${option.disabled || disabled ? 'cursor-not-allowed opacity-50' : ''}
            ${textSizeStyles[size]}
          `.trim()}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => !option.disabled && !disabled && onChange(option.value)}
            disabled={option.disabled || disabled}
            className={`
              appearance-none
              ${sizeStyles[size]}
              border
              border-gray-300
              rounded-full
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
            `.trim()}
          />
          <span className={`
            text-gray-900
            ${option.disabled || disabled ? 'text-gray-400' : ''}
          `.trim()}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  )
})

RadioGroup.displayName = 'RadioGroup'

export default RadioGroup