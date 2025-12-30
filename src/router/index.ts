import React from 'react'

// 路由自动发现系统
// 通过 Vite 的 import.meta.glob 自动发现和配置页面路由

// 页面元数据接口
export interface PageMeta {
  title: string
  description: string
  path: string
  icon: string
  permissions?: string[] // 访问页面所需的权限列表
  showInMenu?: boolean // 是否在导航菜单中显示，默认true
  canOpenWindow?: boolean // 是否支持单独打开窗口，默认false
}

// 页面模块接口
export interface PageModule {
  default: React.ComponentType
  pageMeta?: PageMeta
}

// 动态路由配置接口
export interface RouteConfig {
  path: string
  component: React.LazyExoticComponent<React.ComponentType>
  meta?: PageMeta
  loader: () => Promise<PageModule>
}

// 使用 Vite 的 import.meta.glob 自动发现页面
const pageModules = import.meta.glob('../pages/*/index.tsx') as Record<string, () => Promise<PageModule>>

console.log('🔍 import.meta.glob 模式: ../pages/*/index.tsx')
console.log('🔍 发现的页面模块数量:', Object.keys(pageModules).length)
console.log('🔍 发现的页面模块路径:', Object.keys(pageModules))

// 额外检查login页面
const loginModule = import.meta.glob('../pages/login/index.tsx')
console.log('🔍 单独检查login页面:', Object.keys(loginModule))

// 生成路由配置（同步版本，返回懒加载组件）
export const generateRoutes = (): RouteConfig[] => {
  const routes: RouteConfig[] = []

  console.log(`📋 开始生成路由配置，发现 ${Object.keys(pageModules).length} 个页面模块`)

  for (const [path, moduleLoader] of Object.entries(pageModules)) {
    console.log('🔍 处理页面路径:', path)
    // 从文件路径提取路由路径
    // ../pages/home/index.tsx -> home -> /home
    // ../pages/counter/index.tsx -> counter -> /counter
    const routePath = path.replace('../pages/', '').replace('/index.tsx', '')
    const finalPath = routePath === 'home' ? '/' : `/${routePath}`

    console.log(`📍 生成路由: ${path} -> ${finalPath}`)

    // 创建懒加载组件
    const LazyComponent = React.lazy(async () => {
      try {
        const module = await moduleLoader()
        console.log(`✅ 懒加载页面: ${finalPath} -> ${module.pageMeta?.title || '未命名页面'}`)
        return { default: module.default }
      } catch (error) {
        console.error(`❌ 页面加载失败: ${path}`, error)
        // 返回错误组件
        return {
          default: () => React.createElement('div', {
            style: {
              padding: '2rem',
              textAlign: 'center',
              color: '#dc2626'
            }
          },
            React.createElement('h2', null, '页面加载失败'),
            React.createElement('p', null, `无法加载页面：${finalPath}`)
          )
        }
      }
    })

    routes.push({
      path: finalPath,
      component: LazyComponent,
      loader: moduleLoader,
      meta: undefined // 懒加载时无法同步获取元数据
    })
  }

  console.log(`🎯 路由生成完成，共 ${routes.length} 个路由:`, routes.map(r => r.path))

  // 按路径长度排序，确保根路径 '/' 排在前面
  const sortedRoutes = routes.sort((a, b) => {
    if (a.path === '/') return -1
    if (b.path === '/') return 1
    return a.path.length - b.path.length
  })

  console.log('📋 路由排序完成:', sortedRoutes.map(r => r.path))
  return sortedRoutes
}

// 异步版本：获取路由配置和元数据（用于导航菜单等）
export const getRoutesWithMeta = async (): Promise<RouteConfig[]> => {
  const routes = generateRoutes()

  // 并行加载所有页面的元数据
  const routesWithMeta = await Promise.all(
    routes.map(async (route) => {
      try {
        const module = await route.loader()
        return {
          ...route,
          meta: module.pageMeta
        }
      } catch (error) {
        console.warn(`⚠️ 无法获取页面元数据: ${route.path}`, error)
        return route
      }
    })
  )

  return routesWithMeta
}

// 预加载页面（可选，用于提升用户体验）
export const preloadRoute = async (path: string): Promise<void> => {
  const route = generateRoutes().find(r => r.path === path)
  if (route) {
    try {
      await route.loader()
      console.log(`🚀 预加载完成: ${path}`)
    } catch (error) {
      console.warn(`⚠️ 预加载失败: ${path}`, error)
    }
  }
}

// 智能预加载（根据当前路由预加载可能访问的页面）
export const preloadNearbyRoutes = async (currentPath: string): Promise<void> => {
  const routes = generateRoutes()
  const currentIndex = routes.findIndex(r => r.path === currentPath)

  if (currentIndex !== -1) {
    // 预加载相邻的路由
    const nearbyRoutes = [
      routes[currentIndex - 1], // 上一个
      routes[currentIndex + 1], // 下一个
    ].filter(Boolean)

    await Promise.allSettled(
      nearbyRoutes.map(route => preloadRoute(route.path))
    )
  }
}

// 获取导航菜单项（基于路由配置，只显示 showInMenu 为 true 的路由）
export const getNavigationItems = (routes: RouteConfig[]) => {
  return routes
    .filter(route => route.meta?.showInMenu !== false) // 默认显示，除非明确设置为 false
    .map(route => ({
      path: route.path,
      label: route.meta?.icon ? `${route.meta.icon} ${route.meta.title}` : route.meta?.title || '未命名',
      description: route.meta?.description || '',
      canOpenWindow: route.meta?.canOpenWindow || false
    }))
}

// 权限检查函数
export const checkRoutePermission = (route: RouteConfig, userPermissions: string[] = []): boolean => {
  const requiredPermissions = route.meta?.permissions
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true // 无权限要求，默认允许访问
  }
  return requiredPermissions.every(permission => userPermissions.includes(permission))
}

// 检查路由是否可以打开新窗口
export const canOpenRouteInWindow = (route: RouteConfig): boolean => {
  return route.meta?.canOpenWindow === true
}

// 获取支持窗口打开的路由
export const getWindowRoutes = (routes: RouteConfig[]) => {
  return routes.filter(route => canOpenRouteInWindow(route))
}
