// 认证相关API服务
// 统一管理登录、注册等认证请求

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  message?: string
  token?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 模拟API延迟
const simulateDelay = (ms: number = 2000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 模拟用户数据库
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    email: 'admin@example.com',
    avatar: '👤'
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    name: '普通用户',
    email: 'user@example.com',
    avatar: '👨‍💻'
  }
]

// 模拟登录API
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  console.log('🔐 发起登录请求:', credentials.username)

  // 模拟网络延迟
  await simulateDelay()

  // 查找用户
  const user = mockUsers.find(u =>
    u.username === credentials.username && u.password === credentials.password
  )

  if (user) {
    console.log('✅ 登录成功:', user.name)

    // 移除密码信息
    const { password, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token: `mock-token-${user.id}-${Date.now()}`,
      message: `欢迎回来，${user.name}！`
    }
  } else {
    console.log('❌ 登录失败: 用户名或密码错误')

    return {
      success: false,
      message: '用户名或密码错误，请检查后重试'
    }
  }
}

// 模拟登出API（如果需要）
export const logout = async (): Promise<ApiResponse<null>> => {
  console.log('🚪 发起登出请求')

  await simulateDelay(500)

  console.log('✅ 登出成功')

  return {
    success: true,
    message: '已成功登出'
  }
}

// 模拟检查登录状态API
export const checkAuth = async (token?: string): Promise<ApiResponse<{ isValid: boolean }>> => {
  console.log('🔍 检查认证状态')

  await simulateDelay(300)

  // 简单token验证（实际项目中应该验证token有效性）
  const isValid: boolean = !!(token && token.startsWith('mock-token-'))

  return {
    success: true,
    data: { isValid }
  }
}

// 统一的错误处理函数
export const handleApiError = (error: any): string => {
  console.error('API请求错误:', error)

  if (error.message) {
    return error.message
  }

  return '网络请求失败，请稍后重试'
}
