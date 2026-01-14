import React, { forwardRef } from 'react'

export interface TextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  size?: 'sm' | 'md' | 'lg'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  rows = 4,
  resize = 'vertical',
  size = 'md',
  ...props
}, ref) => {
  // 尺寸样式
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  }

  // 调整大小样式
  const resizeStyles = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  }

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
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
        ${resizeStyles[resize]}
        ${className}
      `.trim()}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

export default Textarea