import React, { forwardRef, useState } from 'react'

export interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  showToggle?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
  value,
  onChange,
  placeholder,
  disabled = false,
  showToggle = true,
  className = '',
  size = 'md',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-2 py-1 pr-8 text-sm',
    md: 'px-3 py-2 pr-10',
    lg: 'px-4 py-3 pr-12 text-lg'
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
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
        `.trim()}
        {...props}
      />

      {/* 密码可见性切换按钮 */}
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="
            absolute
            right-2
            top-1/2
            transform
            -translate-y-1/2
            p-1
            text-gray-500
            hover:text-gray-700
            focus:outline-none
            focus:text-gray-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-colors
            duration-200
          "
          title={showPassword ? '隐藏密码' : '显示密码'}
        >
          {showPassword ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput