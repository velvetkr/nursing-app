<template>
  <view class="login-page">
    <!-- Logo 区域 -->
    <view class="logo-section">
      <view class="logo-icon">
        <u-icon name="heart-fill" size="60" color="#4A90D9" />
      </view>
      <text class="app-name">智慧护理</text>
      <text class="app-slogan">专业的居家护理服务平台</text>
    </view>

    <!-- 登录表单 -->
    <view class="form-section">
      <view class="form-card">
        <!-- 登录方式 Tab -->
        <view class="login-tabs">
          <view
            class="tab-item"
            :class="{ active: loginMode === 'password' }"
            @click="loginMode = 'password'"
          >
            <text class="tab-text">密码登录</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: loginMode === 'sms' }"
            @click="loginMode = 'sms'"
          >
            <text class="tab-text">验证码登录</text>
          </view>
        </view>

        <!-- 手机号 -->
        <view class="input-group">
          <text class="input-label">手机号</text>
          <u-input
            v-model="phone"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            border="bottom"
            clearable
          >
            <template #prefix>
              <u-icon name="phone" size="20" color="#999" />
            </template>
          </u-input>
        </view>

        <!-- 密码模式 -->
        <view v-if="loginMode === 'password'" class="input-group">
          <text class="input-label">密码</text>
          <u-input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            border="bottom"
          >
            <template #prefix>
              <u-icon name="lock" size="20" color="#999" />
            </template>
          </u-input>
          <text class="forgot-pwd" @click="forgotPassword">忘记密码？</text>
        </view>

        <!-- 验证码模式 -->
        <view v-if="loginMode === 'sms'" class="input-group">
          <text class="input-label">验证码</text>
          <view class="code-row">
            <u-input
              v-model="code"
              type="number"
              maxlength="6"
              placeholder="请输入验证码"
              border="bottom"
              class="code-input"
            >
              <template #prefix>
                <u-icon name="lock" size="20" color="#999" />
              </template>
            </u-input>
            <u-button
              type="primary"
              :plain="true"
              :disabled="countdown > 0 || phone.length !== 11"
              size="small"
              @click="sendCode"
              text="获取验证码"
              class="code-btn"
            >
              <text v-if="countdown > 0">{{ countdown }}s</text>
              <text v-else>获取验证码</text>
            </u-button>
          </view>
        </view>

        <!-- 登录按钮 -->
        <u-button
          type="primary"
          shape="round"
          :loading="submitting"
          :disabled="!canSubmit"
          @click="handleLogin"
          class="submit-btn"
        >
          登 录
        </u-button>

        <!-- 底部提示 -->
        <view class="form-footer">
          <text class="footer-text">还没有账号？</text>
          <text class="footer-link" @click="goRegister">立即注册</text>
        </view>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <text class="agreement-text">
        登录即表示同意《用户服务协议》和《隐私政策》
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const loginMode = ref('password') // 'password' | 'sms'
const phone = ref('')
const code = ref('')
const password = ref('')
const countdown = ref(0)
const submitting = ref(false)
let timer = null

const canSubmit = computed(() => {
  if (phone.value.length !== 11 || submitting.value) return false
  if (loginMode.value === 'password') {
    return password.value.length >= 6
  }
  return code.value.length >= 4
})

function sendCode() {
  if (phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  userStore.sendVerifyCode(phone.value)
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

async function handleLogin() {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    await userStore.login(phone.value, code.value || password.value, loginMode.value)
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (e) {
    uni.showToast({ title: e.message || '登录失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function forgotPassword() {
  uni.showToast({ title: '请使用验证码登录后重置密码', icon: 'none' })
}

function goRegister() {
  uni.navigateTo({ url: '/pages/register/register' })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: $bg-color-grey;
  display: flex;
  flex-direction: column;
}

/* Logo */
.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0 32rpx;
}

.logo-icon {
  width: 120rpx;
  height: 120rpx;
  background-color: $primary-bg;
  border-radius: $radius-round;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-md;
}

.app-name {
  font-size: 48rpx;
  font-weight: 700;
  color: $text-color;
}

.app-slogan {
  font-size: $font-size-base;
  color: $text-color-hint;
  margin-top: $spacing-xs;
}

/* 表单 */
.form-section {
  flex: 1;
  padding: 0 $spacing-base;
}

.form-card {
  background: $bg-color;
  border-radius: $radius-lg;
  padding: 40rpx $spacing-lg;
  box-shadow: $shadow-base;
}

/* 登录方式 Tab */
.login-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
  gap: 48rpx;
}

.tab-item {
  padding-bottom: 16rpx;
  border-bottom: 4rpx solid transparent;

  &.active {
    border-bottom-color: $primary-color;

    .tab-text {
      color: $primary-color;
      font-weight: 600;
    }
  }
}

.tab-text {
  font-size: $font-size-md;
  color: $text-color-secondary;
}

/* 输入组 */
.input-group {
  margin-bottom: 28rpx;
}

.input-label {
  font-size: $font-size-sm;
  color: $text-color-secondary;
  margin-bottom: 8rpx;
  display: block;
}

/* 验证码行 */
.code-row {
  display: flex;
  align-items: flex-end;
}

.code-input {
  flex: 1;
}

.code-btn {
  margin-left: 16rpx;
  min-width: 200rpx !important;
  height: 64rpx !important;
  font-size: 24rpx !important;
  flex-shrink: 0;
}

.forgot-pwd {
  display: block;
  text-align: right;
  font-size: $font-size-sm;
  color: $primary-color;
  margin-top: 12rpx;
}

/* 提交按钮 */
.submit-btn {
  margin-top: $spacing-lg;
  width: 100%;
}

/* 底部 */
.form-footer {
  display: flex;
  justify-content: center;
  margin-top: $spacing-lg;
}

.footer-text {
  font-size: $font-size-base;
  color: $text-color-hint;
}

.footer-link {
  font-size: $font-size-base;
  color: $primary-color;
  margin-left: 8rpx;
}

/* 协议 */
.agreement {
  padding: 32rpx $spacing-base;
  text-align: center;
}

.agreement-text {
  font-size: $font-size-xs;
  color: $text-color-disabled;
}
</style>
