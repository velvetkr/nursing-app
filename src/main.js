import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import uviewPlus from 'uview-plus'

import App from './App.vue'
import './uni.scss'

// 初始化 Mock（仅开发环境）
if (import.meta.env.DEV) {
  import('./mock/index.js')
}

export function createApp() {
  const app = createSSRApp(App)

  // Pinia 状态管理
  app.use(createPinia())

  // uView Plus UI 组件库
  app.use(uviewPlus)

  return { app }
}
