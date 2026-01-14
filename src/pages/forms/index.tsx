// Forms 页面路由入口
export { default } from './page'

// 页面元数据
export const pageMeta = {
  title: '表单组件',
  description: '展示各种表单组件的使用示例和常见表单场景',
  path: '/forms',
  icon: '📝',
  permissions: [], // 无特殊权限要求
  showInMenu: true, // 在菜单中显示
  canOpenWindow: true // 支持单独打开窗口
}

console.log('📝 Forms页面模块已加载，元数据:', pageMeta)