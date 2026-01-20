import { ipcMain, BrowserWindow, dialog, Notification, clipboard } from 'electron'
import log from 'electron-log'
import { BROADCAST_CHANNELS, handleBroadcast, registerBroadcastHandlers } from './broadcastManager'
import { createBrowserWindow } from './windowManager'

/**
 * IPC 处理器类型定义
 */
export type IPCHandler = (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any | Promise<any>
export type IPCOnHandler = (event: Electron.IpcMainEvent, ...args: any[]) => void

/**
 * IPC 通道配置接口
 */
export interface IPCChannelConfig {
  handler: IPCHandler | IPCOnHandler
  type: 'handle' | 'on' | 'once'
  requiresWindow?: boolean  // 是否需要窗口焦点
}

/**
 * IPC 管理器类 - 统一管理所有 IPC 通道
 */
export class IPCHandlerManager {
  private static instance: IPCHandlerManager
  private channels: Map<string, IPCChannelConfig> = new Map()

  private constructor() {
    this.initializeChannels()
  }

  public static getInstance(): IPCHandlerManager {
    if (!IPCHandlerManager.instance) {
      IPCHandlerManager.instance = new IPCHandlerManager()
    }
    return IPCHandlerManager.instance
  }

  /**
   * 初始化所有 IPC 通道
   */
  private initializeChannels() {
    // 窗口控制
    this.addChannel('window:minimize', {
      handler: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        focusedWindow?.minimize()
      },
      type: 'handle',
      requiresWindow: true
    })

    this.addChannel('window:maximize', {
      handler: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        focusedWindow?.maximize()
      },
      type: 'handle',
      requiresWindow: true
    })

    this.addChannel('window:close', {
      handler: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        focusedWindow?.close()
      },
      type: 'handle',
      requiresWindow: true
    })

    this.addChannel('window:toggle-maximize', {
      handler: () => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow?.isMaximized()) {
          focusedWindow.unmaximize()
        } else {
          focusedWindow?.maximize()
        }
      },
      type: 'handle',
      requiresWindow: true
    })

    this.addChannel('window:open', {
      handler: async (event: Electron.IpcMainInvokeEvent, routePath: string, title: string) => {
        try {
          const senderWindow = BrowserWindow.fromWebContents(event.sender)
          const newWindow = createBrowserWindow({
            width: 1000,
            height: 700,
            title: title,
            routePath: routePath,
            parent: senderWindow || undefined,
            isMainWindow: false
          })

          return { success: true, windowId: newWindow.id }
        } catch (error) {
          console.error('Failed to open window:', error)
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
      },
      type: 'handle'
    })

    // 文件对话框
    this.addChannel('dialog:openFile', {
      handler: async (event: Electron.IpcMainInvokeEvent, options?: any) => {
        const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow()!, {
          title: options?.title || '选择文件',
          filters: options?.filters,
          properties: options?.properties || ['openFile']
        })
        return result.canceled ? null : result.filePaths
      },
      type: 'handle'
    })

    this.addChannel('dialog:saveFile', {
      handler: async (event: Electron.IpcMainInvokeEvent, options?: any) => {
        const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow()!, {
          title: options?.title || '保存文件',
          filters: options?.filters,
          defaultPath: options?.defaultPath
        })
        return result.canceled ? null : result.filePath
      },
      type: 'handle'
    })

    // 通知
    this.addChannel('notification:show', {
      handler: (event: Electron.IpcMainInvokeEvent, options: any) => {
        new Notification({
          title: options.title,
          body: options.body,
          icon: options.icon
        }).show()
      },
      type: 'handle'
    })

    // 剪贴板
    this.addChannel('clipboard:readText', {
      handler: (event: Electron.IpcMainEvent) => {
        event.returnValue = clipboard.readText()
      },
      type: 'on'
    })

    this.addChannel('clipboard:writeText', {
      handler: (event: Electron.IpcMainInvokeEvent, text: string) => {
        clipboard.writeText(text)
      },
      type: 'handle'
    })

    // 日志
    this.addChannel('log:info', {
      handler: (event: Electron.IpcMainInvokeEvent, message: string, ...args: any[]) => {
        log.info(message, ...args)
      },
      type: 'handle'
    })

    this.addChannel('log:error', {
      handler: (event: Electron.IpcMainInvokeEvent, message: string, ...args: any[]) => {
        log.error(message, ...args)
      },
      type: 'handle'
    })

    this.addChannel('log:warn', {
      handler: (event: Electron.IpcMainInvokeEvent, message: string, ...args: any[]) => {
        log.warn(message, ...args)
      },
      type: 'handle'
    })

    this.addChannel('log:debug', {
      handler: (event: Electron.IpcMainInvokeEvent, message: string, ...args: any[]) => {
        log.debug(message, ...args)
      },
      type: 'handle'
    })
  }

  /**
   * 添加 IPC 通道
   */
  private addChannel(channel: string, config: IPCChannelConfig) {
    this.channels.set(channel, config)
  }

  /**
   * 注册所有 IPC 通道
   */
  public registerAllChannels() {
    for (const [channel, config] of this.channels) {
      switch (config.type) {
        case 'handle':
          ipcMain.handle(channel, config.handler as IPCHandler)
          break
        case 'on':
          ipcMain.on(channel, config.handler as IPCOnHandler)
          break
        case 'once':
          ipcMain.once(channel, config.handler as IPCOnHandler)
          break
      }
    }

    // 注册广播处理器
    registerBroadcastHandlers()
  }

  /**
   * 获取所有通道名称（用于类型定义）
   */
  public getAllChannelNames(): string[] {
    return Array.from(this.channels.keys()).concat(Object.keys(BROADCAST_CHANNELS))
  }
}

// 导出单例实例
export const ipcHandlerManager = IPCHandlerManager.getInstance()
