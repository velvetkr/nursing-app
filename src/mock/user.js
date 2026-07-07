/**
 * Mock — 用户模块（登录/注册/验证码）
 */
import Mock from 'mockjs'

const Random = Mock.Random

// ========== 模拟用户数据 ==========
const users = new Map()

// 预设测试账号（密码: 123456）
users.set('13800138000', {
  id: '10001',
  phone: '13800138000',
  password: '123456',
  nickname: '测试用户',
  avatar: '',
  createTime: '2026-01-15',
})

// ========== 发送验证码 ==========
Mock.mock(/\/api\/user\/send-code/, 'post', (options) => {
  const { phone } = JSON.parse(options.body)
  console.log(`[Mock] 发送验证码到 ${phone}，验证码: 123456`)
  return {
    code: 200,
    data: { expire: 300 },
    message: '验证码已发送',
  }
})

// ========== 登录（密码 / 验证码双模式） ==========
Mock.mock(/\/api\/user\/login/, 'post', (options) => {
  const { phone, mode, password, code } = JSON.parse(options.body)

  let user = users.get(phone)

  // 密码登录模式
  if (mode === 'password' || password) {
    if (!user) {
      return { code: 10002, data: null, message: '该手机号未注册，请先注册' }
    }
    if (user.password !== password) {
      return { code: 10001, data: null, message: '密码错误，请重试' }
    }
    console.log(`[Mock] 密码登录成功: ${phone}`)
    return {
      code: 200,
      data: {
        token: `mock_token_${user.id}_${Date.now()}`,
        userInfo: { id: user.id, phone: user.phone, nickname: user.nickname, avatar: user.avatar, createTime: user.createTime },
      },
      message: '登录成功',
    }
  }

  // 验证码登录模式
  if (code !== '123456') {
    return { code: 10001, data: null, message: '验证码错误' }
  }

  if (!user) {
    // 验证码登录时：未注册用户自动注册（兼容旧逻辑）
    user = {
      id: Random.id(),
      phone,
      password: '123456', // 默认密码
      nickname: `用户${phone.slice(-4)}`,
      avatar: '',
      createTime: Random.date('yyyy-MM-dd'),
    }
    users.set(phone, user)
  }

  console.log(`[Mock] 验证码登录成功: ${phone}`)
  return {
    code: 200,
    data: {
      token: `mock_token_${user.id}_${Date.now()}`,
      userInfo: { id: user.id, phone: user.phone, nickname: user.nickname, avatar: user.avatar, createTime: user.createTime },
    },
    message: '登录成功',
  }
})

// ========== 注册（验证码 + 设置密码） ==========
Mock.mock(/\/api\/user\/register/, 'post', (options) => {
  const { phone, code, password } = JSON.parse(options.body)

  if (code !== '123456') {
    return { code: 10001, data: null, message: '验证码错误' }
  }

  if (users.has(phone)) {
    return { code: 10002, data: null, message: '该手机号已注册，请直接登录' }
  }

  if (!password || password.length < 6) {
    return { code: 10003, data: null, message: '密码至少6位' }
  }

  const user = {
    id: Random.id(),
    phone,
    password,
    nickname: `用户${phone.slice(-4)}`,
    avatar: '',
    createTime: Random.date('yyyy-MM-dd'),
  }
  users.set(phone, user)

  console.log(`[Mock] 注册成功: ${phone}`)
  return {
    code: 200,
    data: {
      token: `mock_token_${user.id}_${Date.now()}`,
      userInfo: { id: user.id, phone: user.phone, nickname: user.nickname, avatar: user.avatar, createTime: user.createTime },
    },
    message: '注册成功',
  }
})
