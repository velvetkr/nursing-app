/**
 * 网络请求层 — uni.request 封装
 *
 * 功能：Token 注入、异常拦截、请求/响应拦截、超时处理
 */
import { getToken, removeToken } from './storage.js'

const BASE_URL = '' // 后端 API 基地址，联调时替换
const TIMEOUT = 15000

// 请求中的 pending 状态，避免重复提交
const pendingMap = new Map()

function getRequestKey(config) {
  const { url, method, data } = config
  return `${method || 'GET'}_${url}_${JSON.stringify(data || {})}`
}

/**
 * 统一请求方法
 * @param {Object} options - 请求配置
 * @returns {Promise}
 */
function request(options = {}) {
  return new Promise((resolve, reject) => {
    const token = getToken()

    // 请求头
    const header = {
      'Content-Type': 'application/json',
      ...options.header,
    }
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    // 发起请求
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      timeout: options.timeout || TIMEOUT,
      success: (res) => {
        const { statusCode, data } = res

        // HTTP 状态码判断
        if (statusCode === 200) {
          // 业务状态码判断（假设后端返回 { code, data, message }）
          if (data.code === 0 || data.code === 200) {
            resolve(data)
          } else if (data.code === 401) {
            // 登录态过期
            removeToken()
            uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' })
            }, 1500)
            reject(data)
          } else {
            uni.showToast({ title: data.message || '请求失败', icon: 'none' })
            reject(data)
          }
        } else if (statusCode === 401) {
          removeToken()
          uni.showToast({ title: '登录已过期', icon: 'none' })
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/login/login' })
          }, 1500)
          reject(res)
        } else {
          uni.showToast({ title: `网络错误 (${statusCode})`, icon: 'none' })
          reject(res)
        }
      },
      fail: (err) => {
        // 网络异常
        const msg = err.errMsg || '网络连接失败'
        if (msg.includes('timeout')) {
          uni.showToast({ title: '请求超时，请重试', icon: 'none' })
        } else if (msg.includes('fail')) {
          uni.showToast({ title: '网络不可用，请检查连接', icon: 'none' })
        }
        reject(err)
      },
    })
  })
}

// ========== 快捷方法 ==========

const http = {
  get(url, data, options = {}) {
    return request({ url, method: 'GET', data, ...options })
  },
  post(url, data, options = {}) {
    return request({ url, method: 'POST', data, ...options })
  },
  put(url, data, options = {}) {
    return request({ url, method: 'PUT', data, ...options })
  },
  delete(url, data, options = {}) {
    return request({ url, method: 'DELETE', data, ...options })
  },
  /** 上传文件 */
  upload(url, filePath, formData = {}, options = {}) {
    const token = getToken()
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: BASE_URL + url,
        filePath,
        name: 'file',
        formData,
        header: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: options.timeout || 30000,
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch {
            reject(res)
          }
        },
        fail: reject,
      })
    })
  },
}

export default http
export { request, BASE_URL }
