/**
 * Mock 数据入口 — 仅开发环境加载
 * 后端未就绪时模拟所有 API 响应
 */
import Mock from 'mockjs'
import './user.js'
import './service.js'

// 全局 Mock 配置
Mock.setup({
  timeout: '200-500', // 模拟网络延迟 200-500ms
})

console.log('[Mock] 已启用 — 拦截所有 API 请求')
