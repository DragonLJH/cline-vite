import React, { forwardRef } from 'react'

export interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled = false,
  className = '',
  size = 'md',
  ...props
}, ref) => {
  // 尺寸样式
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  }

  // 处理数值变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value)

    // 验证数值范围
    if (min !== undefined && newValue < min) return
    if (max !== undefined && newValue > max) return

    // 检查是否为有效数字
    if (!isNaN(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <input
      ref={ref}
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        appearance-none
        w-full
        border border-gray-300
        rounded-lg
        bg-white
        text-gray-900
        placeholder-gray-500
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-transparent
        hover:border-gray-400
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:bg-gray-50
        transition-colors
        duration-200
        ${sizeStyles[size]}
        ${className}
      `.trim()}
      {...props}
    />
  )
})

NumberInput.displayName = 'NumberInput'

export default NumberInput