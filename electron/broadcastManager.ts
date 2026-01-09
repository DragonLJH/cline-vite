import { ipcMain } from 'electron'
import { broadcastToWindows } from './utils'

/**
 * 广播配置接口
 */
export interface BroadcastConfig {
  includeSender: boolean     // 是否包含发送者窗口
  transformData?: (data: any) => any  // 数据转换函数（可选）
  logMessage?: (data: any) => string // 日志消息生成函数（可选）
}

/**
 * 广播通道配置映射表
 */
export const BROADCAST_CHANNELS: Record<string, BroadcastConfig> = {
  'theme:changed': {
    includeSender: false
  },
  'login:success': {
    includeSender: true,
    logMessage: (data) => `📡 主进程收到登录成功事件: ${JSON.stringify(data)}`
  },
  'login:success:back': {
    includeSender: true
  }
}

/**
 * 统一的广播事件处理器
 */
export function handleBroadcast(event: Electron.IpcMainEvent, channel: string, ...args: any[]) {
  const config = BROADCAST_CHANNELS[channel]
  if (!config) {
    console.warn(`⚠️ 未配置的广播通道: ${channel}`)
    return
  }

  // 获取要广播的数据
  const data = config.transformData ? config.transformData(args[0]) : args[0]

  // 记录日志
  if (config.logMessage && args[0]) {
    console.log(config.logMessage(args[0]))
  }

  // 执行广播
  broadcastToWindows(channel, data, config.includeSender, event)
}

/**
 * 注册所有广播事件处理器
 */
export function registerBroadcastHandlers() {
  Object.keys(BROADCAST_CHANNELS).forEach(channel => {
    ipcMain.on(channel, (event, ...args) => handleBroadcast(event, channel, ...args))
  })
}