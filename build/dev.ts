import { createServer } from 'vite'
import { spawn } from 'child_process'
import { execSync } from 'child_process'
import * as path from 'path'

async function startDevServer() {
  // 编译 Electron preload 脚本
  console.log('Compiling Electron preload script...')
  try {
    execSync('npx tsc --project tsconfig.json', { stdio: 'inherit' })
    console.log('✅ Preload script compiled successfully')
  } catch (error) {
    console.error('❌ Failed to compile preload script:', error)
    process.exit(1)
  }

  // 启动 Vite 开发服务器
  const server = await createServer({
    configFile: 'vite.config.ts',
    root: process.cwd(),
    server: {
      port: 5173,
      host: 'localhost'
    }
  })

  await server.listen()
  console.log('Vite dev server started at http://localhost:5173')

  // 等待服务器完全启动
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 启动 Electron 应用
  console.log('Starting Electron...')
  const electron = spawn('npx', ['electron', '.'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  })

  // 处理 Electron 进程结束
  electron.on('close', (code) => {
    console.log(`Electron exited with code ${code}`)
    server.close()
    process.exit(code || 0)
  })

  // 处理中断信号
  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down...')
    electron.kill()
    server.close()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down...')
    electron.kill()
    server.close()
    process.exit(0)
  })
}

startDevServer().catch((error) => {
  console.error('Failed to start dev server:', error)
  process.exit(1)
})
