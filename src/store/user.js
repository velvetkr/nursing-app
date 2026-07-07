/**
 * Pinia — 用户状态管理
 *
 * 管理：登录/注册、Token、用户信息、登录态
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  isLoggedIn as checkLogin,
} from '@/utils/storage.js'
import http from '@/utils/request.js'

export const useUserStore = defineStore(
  'user',
  () => {
    // ===== 状态 =====
    const token = ref(getToken() || '')
    const userInfo = ref(getUserInfo() || null)
    const isLogin = ref(checkLogin())

    // ===== 计算属性 =====
    const isLoggedIn = computed(() => isLogin.value && !!token.value)
    const phone = computed(() => userInfo.value?.phone || '')

    // ===== 方法 =====

    /** 发送验证码 */
    async function sendVerifyCode(phoneNumber) {
      const res = await http.post('/api/user/send-code', { phone: phoneNumber })
      return res
    }

    /** 登录（支持密码/验证码双模式） */
    async function login(phoneNumber, credential, mode = 'password') {
      const res = await http.post('/api/user/login', {
        phone: phoneNumber,
        [mode === 'password' ? 'password' : 'code']: credential,
        mode,
      })
      const { token: newToken, userInfo: info } = res.data
      token.value = newToken
      userInfo.value = info
      isLogin.value = true
      setToken(newToken)
      setUserInfo(info)
      return res
    }

    /** 手机号+验证码注册（需设置密码） */
    async function register(phoneNumber, code, password) {
      const res = await http.post('/api/user/register', {
        phone: phoneNumber,
        code,
        password,
      })
      return res
    }

    /** 退出登录 */
    function doLogout() {
      token.value = ''
      userInfo.value = null
      isLogin.value = false
      removeToken()
      removeUserInfo()
      uni.reLaunch({ url: '/pages/login/login' })
    }

    /** 更新用户信息 */
    function updateUserInfo(info) {
      userInfo.value = { ...userInfo.value, ...info }
      setUserInfo(userInfo.value)
    }

    return {
      token,
      userInfo,
      isLogin,
      isLoggedIn,
      phone,
      sendVerifyCode,
      login,
      register,
      doLogout,
      updateUserInfo,
    }
  }
)
