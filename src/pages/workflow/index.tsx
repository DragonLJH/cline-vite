// 工作流页面路由入口
export { default } from './page'

// 页面元数据
export const pageMeta = {
  title: '工作流组件',
  description: '展示各种流程相关组件的使用示例',
  path: '/workflow',
  icon: '⚙️',
  permissions: [], // 无特殊权限要求
  showInMenu: true, // 在菜单中显示
  canOpenWindow: true // 支持单独打开窗口
}

console.log('⚙️ Workflow页面模块已加载，元数据:', pageMeta)
