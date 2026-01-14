import React, { forwardRef } from 'react'

export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  // Form集成属性
  value?: boolean
  name?: string
  error?: boolean
  errorMessage?: string
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  value, // Form传递的值
  ...props
}, ref) => {
  // 添加组件类型标识符
  const componentProps = {
    ...props,
    __isSwitch: true
  }

  // 处理Form集成：优先使用value，否则使用checked
  const isChecked = value !== undefined ? value : (checked || false)

  // 处理点击事件
  const handleClick = () => {
    if (disabled) return
    const newValue = !isChecked
    if (onChange) {
      onChange(newValue)
    }
  }

  // 尺寸样式 - 优化设计
  const sizeStyles = {
    sm: {
      container: 'w-9 h-5',
      button: 'w-4 h-4',
      translate: 'translate-x-4'
    },
    md: {
      container: 'w-12 h-7',
      button: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      container: 'w-16 h-9',
      button: 'w-7 h-7',
      translate: 'translate-x-7'
    }
  }

  const currentSize = sizeStyles[size]

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative
        inline-flex
        shrink-0
        cursor-pointer
        rounded-full
        border-2
        border-transparent
        transition-all
        duration-300
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        hover:shadow-md
        active:scale-95
        ${currentSize.container}
        ${isChecked
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200'
          : 'bg-gray-300 hover:bg-gray-400'
        }
        ${className}
      `.trim()}
      role="switch"
      aria-checked={isChecked}
      {...componentProps}
    >
      <span
        className={`
          pointer-events-none
          inline-block
          rounded-full
          bg-white
          shadow-lg
          transform
          ring-0
          transition-all
          duration-300
          ease-in-out
          ${currentSize.button}
          ${isChecked ? currentSize.translate : 'translate-x-0.5'}
        `.trim()}
      />
    </button>
  )
})

Switch.displayName = 'Switch'

export default Switch