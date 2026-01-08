import { app, BrowserWindow, ipcMain, dialog, Notification, clipboard } from 'electron'
import * as path from 'path'

/**
 * 广播事件到窗口
 * @param eventName 事件名
 * @param data 传递的数据
 * @param includeSender 是否包含发送者窗口
 * @param event IPC 事件对象（用于自动获取和验证发送者窗口）
 */
function broadcastToWindows(eventName: string, data?: any, includeSender: boolean = false, event?: Electron.IpcMainEvent) {
  const allWindows = BrowserWindow.getAllWindows()
  let senderWindow: BrowserWindow | null = null

  // 如果提供了 event，获取并验证发送者窗口
  if (event) {
    senderWindow = BrowserWindow.fromWebContents(event.sender)
    if (!senderWindow) return // 发送者窗口无效，直接返回
  }

  allWindows.forEach(window => {
    if (!window.isDestroyed()) {
      if (!includeSender && senderWindow && window.id === senderWindow.id) {
        return // 跳过发送者
      }
      window.webContents.send(eventName, data)
    }
  })
}

/**
 * 广播配置接口
 */
interface BroadcastConfig {
  targetEvent: string        // 广播目标事件名
  includeSender: boolean     // 是否包含发送者窗口
  transformData?: (data: any) => any  // 数据转换函数（可选）
  logMessage?: (data: any) => string // 日志消息生成函数（可选）
}

/**
 * 广播通道配置映射表
 */
const BROADCAST_CHANNELS: Record<string, BroadcastConfig> = {
  'theme:change': {
    targetEvent: 'theme:changed',
    includeSender: false
  },
  'login:success': {
    targetEvent: 'login:success',
    includeSender: true,
    logMessage: (data) => `📡 主进程收到登录成功事件: ${JSON.stringify(data)}`
  },
  'login:success:back': {
    targetEvent: 'login:success:back',
    includeSender: true
  }
}

/**
 * 统一的广播事件处理器
 */
function handleBroadcast(event: Electron.IpcMainEvent, channel: string, ...args: any[]) {
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
  broadcastToWindows(config.targetEvent, data, config.includeSender, event)

  // 特殊处理：登录成功后记录广播完成信息
  if (channel === 'login:success') {
    console.log(`✅ 登录状态同步完成，已广播到 ${BrowserWindow.getAllWindows().length} 个窗口`)
  }
}

/**
 * 注册所有广播事件处理器
 */
function registerBroadcastHandlers() {
  Object.keys(BROADCAST_CHANNELS).forEach(channel => {
    ipcMain.on(channel, (event, ...args) => handleBroadcast(event, channel, ...args))
  })
}

let mainWindow
function createWindow() {
  // 获取 preload 脚本路径
  const preloadPath = path.join(app.getAppPath(), 'dist', 'electron', 'preload.js')

  // 根据平台配置窗口选项
  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    },
    // Windows 平台使用自定义标题栏
    ...(process.platform === 'win32' && {
      frame: false,
      titleBarStyle: 'hidden',
      titleBarOverlay: false
    }),
    // macOS 保留原生标题栏
    ...(process.platform === 'darwin' && {
      titleBarStyle: 'hiddenInset'
    }),
    // Linux 根据需要配置
    ...(process.platform === 'linux' && {
      frame: true
    })
  }

  mainWindow = new BrowserWindow(windowOptions)

  // 开发模式打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  // 开发模式加载 Vite 服务器，生产模式加载打包文件
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    // 在生产模式下，从应用目录加载 index.html
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html')
    // 将路径转换为 file:// URL 格式，确保跨平台兼容性
    const fileUrl = `file://${indexPath.replace(/\\/g, '/')}`
    mainWindow.loadURL(fileUrl)
  }
}

// IPC 处理程序
ipcMain.handle('window:minimize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  focusedWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  focusedWindow?.maximize()
})

ipcMain.handle('window:close', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  focusedWindow?.close()
})

ipcMain.handle('window:toggle-maximize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (focusedWindow?.isMaximized()) {
    focusedWindow.unmaximize()
  } else {
    focusedWindow?.maximize()
  }
})

ipcMain.handle('window:open', async (event, routePath: string, title: string) => {
  try {
    // 获取 preload 脚本路径
    const preloadPath = path.join(app.getAppPath(), 'dist', 'electron', 'preload.js')

    const newWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      title: title,
      parent: mainWindow!,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preloadPath
      },
      // Windows 平台使用自定义标题栏
      ...(process.platform === 'win32' && {
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: false
      }),
      // macOS 保留原生标题栏
      ...(process.platform === 'darwin' && {
        titleBarStyle: 'hiddenInset'
      }),
      // Linux 根据需要配置
      ...(process.platform === 'linux' && {
        frame: true
      })
    })

    // 开发模式加载 Vite 服务器，生产模式加载打包文件
    if (process.env.NODE_ENV === 'development') {
      // 对于HashRouter，需要使用 #/path 格式
      const hashPath = routePath === '/' ? '' : routePath
      await newWindow.loadURL(`http://localhost:5173/#${hashPath}?newwindow=true`)
    } else {
      // 在生产模式下，从应用目录加载 index.html 并导航到指定路径
      const indexPath = path.join(app.getAppPath(), 'dist', 'index.html')
      const hashPath = routePath === '/' ? '' : routePath
      const fileUrl = `file://${indexPath.replace(/\\/g, '/')}#${hashPath}?newwindow=true`
      await newWindow.loadURL(fileUrl)
    }

    // 开发模式打开开发者工具
    if (process.env.NODE_ENV === 'development') {
      newWindow.webContents.openDevTools()
    }

    return { success: true, windowId: newWindow.id }
  } catch (error) {
    console.error('Failed to open window:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

// 文件对话框
ipcMain.handle('dialog:openFile', async (event, options) => {
  const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow()!, {
    title: options?.title || '选择文件',
    filters: options?.filters,
    properties: options?.properties || ['openFile']
  })
  return result.canceled ? null : result.filePaths
})

ipcMain.handle('dialog:saveFile', async (event, options) => {
  const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow()!, {
    title: options?.title || '保存文件',
    filters: options?.filters,
    defaultPath: options?.defaultPath
  })
  return result.canceled ? null : result.filePath
})

// 通知
ipcMain.handle('notification:show', (event, options) => {
  new Notification({
    title: options.title,
    body: options.body,
    icon: options.icon
  }).show()
})

// 剪贴板
ipcMain.on('clipboard:readText', (event) => {
  event.returnValue = clipboard.readText()
})

ipcMain.handle('clipboard:writeText', (event, text) => {
  clipboard.writeText(text)
})

// 注册所有广播事件处理器
registerBroadcastHandlers()

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
