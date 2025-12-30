// Login 页面路由入口
export { default } from './page'

// 页面元数据（可选，用于未来的页面管理系统）
export const pageMeta = {
  title: '登录',
  description: '用户登录页面，输入用户名和密码进行身份验证',
  path: '/login',
  icon: '🔐',
  permissions: [], // 无特殊权限要求
  showInMenu: false,
  canOpenWindow: true // 支持单独打开窗口
}

console.log('🔐 Login页面模块已加载，元数据:', pageMeta)
