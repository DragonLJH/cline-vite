// 窗口类型检测 Hook
import { useLocation } from 'react-router-dom'

export type WindowType = 'main' | 'secondary'

export interface WindowTypeInfo {
  type: WindowType
  isMainWindow: boolean
  isSecondaryWindow: boolean
  hasOpener: boolean
  urlHash: string
  shouldShowNavigation: boolean
}

/**
 * 检测当前窗口类型（主窗口、辅助窗口）
 *
 * 检测逻辑：
 * - 主窗口 (main): 没有 opener 且 URL 中没有 newwindow 参数
 * - 辅助窗口 (secondary): 有 opener 或者 URL 中有 newwindow=true 参数的所有窗口
 *
 * React Router 会自动解析参数，无论 HashRouter 还是 BrowserRouter，
 * newwindow=true 都会出现在 location.search 中。
 */
export const useWindowType = (): WindowTypeInfo => {
  const location = useLocation()

  const hasOpener = !!window.opener

  // 使用 URLSearchParams 优雅地解析查询参数
  const searchParams = new URLSearchParams(location.search)
  const hasNewWindowParam = searchParams.get('newwindow') === 'true'

  const urlHash = location.hash

  // 简化逻辑：任何有 opener 或 newwindow 参数的窗口都是辅助窗口
  const isSecondaryWindow = hasOpener || hasNewWindowParam
  const type: WindowType = isSecondaryWindow ? 'secondary' : 'main'

  const shouldShowNavigation = type === 'main'
  return {
    type,
    isMainWindow: type === 'main',
    isSecondaryWindow: type === 'secondary',
    hasOpener,
    urlHash,
    shouldShowNavigation
  }
}
