import { app, BrowserWindow } from 'electron'
import log from 'electron-log'
import { ipcHandlerManager } from './ipcManager'
import { createBrowserWindow } from './windowManager'
import { appConfig } from './config'

let mainWindow: BrowserWindow

// 配置日志
log.transports.file.level = 'info'
log.transports.console.level = 'debug'
log.info('Application started') // 应用启动

/**
 * 创建主窗口
 */
function createWindow() {
  log.info('Creating main window') // 正在创建主窗口
  mainWindow = createBrowserWindow({
    width: appConfig.windows.main.width,
    height: appConfig.windows.main.height,
    title: appConfig.windows.main.title,
    isMainWindow: true
  })
  log.info('Main window created successfully') // 主窗口创建完成
}

// 注册所有 IPC 通道
ipcHandlerManager.registerAllChannels()

// 应用生命周期事件
app.whenReady().then(() => {
  log.info('Application ready') // 应用已准备就绪
  createWindow()
})

app.on('window-all-closed', () => {
  log.info('All windows closed') // 所有窗口已关闭
  if (process.platform !== 'darwin') {
    log.info('Application quitting') // 应用退出
    app.quit()
  }
})

app.on('activate', () => {
  log.info('Application activated') // 应用激活
  if (BrowserWindow.getAllWindows().length === 0) {
    log.info('Recreating window') // 重新创建窗口
    createWindow()
  }
})
