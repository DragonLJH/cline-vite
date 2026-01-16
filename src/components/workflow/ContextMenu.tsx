import React from 'react'
import { clsx } from 'clsx'

// 菜单项接口
export interface MenuItem {
  id: string
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
  onClick: () => void
}

// 右键菜单属性接口
export interface ContextMenuProps {
  position: { x: number; y: number }
  items: MenuItem[]
  onClose: () => void
  className?: string
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  items,
  onClose,
  className = ''
}) => {
  // 点击外部关闭菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.context-menu')) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // 调整菜单位置，避免超出视窗
  const adjustedPosition = React.useMemo(() => {
    const menuWidth = 160 // 预估菜单宽度
    const menuHeight = items.length * 40 + 16 // 预估菜单高度

    let x = position.x
    let y = position.y

    // 调整水平位置
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10
    }

    // 调整垂直位置
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10
    }

    return { x, y }
  }, [position, items.length])

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      item.onClick()
      onClose()
    }
  }

  return (
    <div
      className={clsx(
        'context-menu fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-40',
        className
      )}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          className={clsx(
            'w-full text-left px-3 py-2 text-sm flex items-center space-x-2 transition-colors',
            'hover:bg-gray-50 focus:outline-none focus:bg-gray-50',
            item.danger && 'text-red-600 hover:bg-red-50 focus:bg-red-50',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {/* 图标 */}
          {item.icon && (
            <span className="text-base">{item.icon}</span>
          )}

          {/* 标签 */}
          <span className="flex-1">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ContextMenu
