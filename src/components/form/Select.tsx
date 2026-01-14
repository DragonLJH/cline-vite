import React, { forwardRef, useState, useRef, useEffect } from 'react'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps {
  value: string | number
  onChange: (value: string | number) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled = false,
  className = '',
  size = 'md',
  ...props
}, ref) => {
  // 添加组件类型标识符
  const componentProps = {
    ...props,
    __isSelect: true
  }
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  }

  // 获取当前选中选项的标签
  const selectedOption = options.find(option => option.value === value)
  const displayText = selectedOption ? selectedOption.label : placeholder

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 处理选项选择
  const handleOptionClick = (option: SelectOption) => {
    if (!option.disabled) {
      onChange(option.value)
      setIsOpen(false)
    }
  }

  // 处理键盘导航
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsOpen(!isOpen)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    } else if (event.key === 'ArrowDown' && !isOpen) {
      event.preventDefault()
      setIsOpen(true)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={ref}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          appearance-none
          w-full
          border border-gray-300
          rounded-lg
          bg-white
          text-gray-900
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
          text-left
          flex
          items-center
          justify-between
          ${sizeStyles[size]}
        `.trim()}
        {...componentProps}
      >
        <span className={selectedOption ? '' : 'text-gray-500'}>
          {displayText}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="
          absolute
          top-full
          left-0
          right-0
          z-50
          mt-1
          bg-white
          border
          border-gray-300
          rounded-lg
          shadow-lg
          max-h-60
          overflow-y-auto
        ">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">
              无选项
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option)}
                disabled={option.disabled}
                className={`
                  w-full
                  px-3
                  py-2
                  text-left
                  hover:bg-gray-100
                  focus:bg-gray-100
                  focus:outline-none
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition-colors
                  duration-150
                  ${option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                  ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                `.trim()}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select