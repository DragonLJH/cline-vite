// Home 页面路由入口
export { default } from './page'

// 页面元数据（可选，用于未来的页面管理系统）
export const pageMeta = {
  title: '首页',
  description: '应用首页，展示核心功能特性',
  path: '/',
  icon: '🏠',
  permissions: [], // 无特殊权限要求
  showInMenu: true, // 在菜单中显示
  canOpenWindow: false // 不支持单独窗口
}
