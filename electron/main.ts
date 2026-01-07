import { app, BrowserWindow, ipcMain, dialog, Notification, clipboard } from 'electron'
import * as path from 'path'
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

// 主题同步
ipcMain.on('theme:change', (event, theme: 'light' | 'dark') => {
  // 获取发送主题更改的窗口ID
  const senderWindow = BrowserWindow.fromWebContents(event.sender)
  if (!senderWindow) return

  // 广播到所有其他窗口
  const allWindows = BrowserWindow.getAllWindows()
  allWindows.forEach(window => {
    if (window.id !== senderWindow.id && !window.isDestroyed()) {
      window.webContents.send('theme:changed', theme)
    }
  })
})

// 登录状态同步
ipcMain.on('login:success', (event, userData: any) => {
  console.log('📡 主进程收到登录成功事件:', userData)

  // 获取发送事件的窗口ID
  const senderWindow = BrowserWindow.fromWebContents(event.sender)
  if (!senderWindow) return

  // 广播到所有窗口（包括发送者，因为单窗口应用中登录页面和主页在同一窗口）
  const allWindows = BrowserWindow.getAllWindows()
  allWindows.forEach(window => {
    if (!window.isDestroyed()) {
      console.log(`📡 广播登录成功事件到窗口 ${window.id}`)
      window.webContents.send('login:success', userData)
    }
  })

  console.log(`✅ 登录状态同步完成，已广播到 ${allWindows.length} 个窗口`)
})

ipcMain.on('login:success:back', (event) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender)
  if (!senderWindow) return
  const allWindows = BrowserWindow.getAllWindows()
  allWindows.forEach(window => {
    if (!window.isDestroyed()) {
      window.webContents.send('login:success:back')
    }
  })

  console.log(`✅ 登录状态同步完成，已广播到 ${allWindows.length} 个窗口`)
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
