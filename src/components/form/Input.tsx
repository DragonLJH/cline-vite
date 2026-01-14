import React, { forwardRef } from 'react'

export interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'date'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  size = 'md',
  type = 'text',
  ...props
}, ref) => {
  // 尺寸样式
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  }

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
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

Input.displayName = 'Input'

export default Input