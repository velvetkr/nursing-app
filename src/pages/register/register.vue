<template>
  <view class="register-page">
    <!-- 标题 -->
    <view class="header">
      <text class="header-title">注册新账号</text>
      <text class="header-desc">注册后即可预约护理服务</text>
    </view>

    <!-- 注册表单 -->
    <view class="form-section">
      <view class="form-card">
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

        <!-- 验证码 -->
        <view class="input-group">
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
              class="code-btn"
            >
              <text v-if="countdown > 0">{{ countdown }}s</text>
              <text v-else>获取验证码</text>
            </u-button>
          </view>
        </view>

        <!-- 设置密码 -->
        <view class="input-group">
          <text class="input-label">设置密码</text>
          <u-input
            v-model="password"
            type="password"
            placeholder="请设置6-20位密码"
            border="bottom"
          >
            <template #prefix>
              <u-icon name="lock-fill" size="20" color="#999" />
            </template>
          </u-input>
        </view>

        <!-- 确认密码 -->
        <view class="input-group">
          <text class="input-label">确认密码</text>
          <u-input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            border="bottom"
          >
            <template #prefix>
              <u-icon name="lock-fill" size="20" color="#999" />
            </template>
          </u-input>
        </view>

        <!-- 注册按钮 -->
        <u-button
          type="primary"
          shape="round"
          :loading="submitting"
          :disabled="!canSubmit"
          @click="handleRegister"
          class="submit-btn"
        >
          注 册
        </u-button>

        <!-- 返回登录 -->
        <view class="form-footer">
          <text class="footer-text">已有账号？</text>
          <text class="footer-link" @click="goLogin">立即登录</text>
        </view>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <text class="agreement-text">
        注册即表示同意《用户服务协议》和《隐私政策》
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const phone = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const countdown = ref(0)
const submitting = ref(false)
let timer = null

const canSubmit = computed(() => {
  return (
    phone.value.length === 11 &&
    code.value.length >= 4 &&
    password.value.length >= 6 &&
    password.value.length <= 20 &&
    password.value === confirmPassword.value &&
    !submitting.value
  )
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

async function handleRegister() {
  if (!canSubmit.value) return

  if (password.value.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' })
    return
  }
  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码输入不一致', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await userStore.register(phone.value, code.value, password.value)
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (e) {
    uni.showToast({ title: e.message || '注册失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function goLogin() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background-color: $bg-color-grey;
}

.header {
  padding: 48rpx $spacing-lg 32rpx;
  text-align: center;
}

.header-title {
  font-size: 44rpx;
  font-weight: 700;
  color: $text-color;
}

.header-desc {
  display: block;
  font-size: $font-size-base;
  color: $text-color-hint;
  margin-top: $spacing-sm;
}

.form-section {
  padding: 0 $spacing-base;
}

.form-card {
  background: $bg-color;
  border-radius: $radius-lg;
  padding: 40rpx $spacing-lg;
  box-shadow: $shadow-base;
}

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

.submit-btn {
  margin-top: $spacing-lg;
  width: 100%;
}

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

.agreement {
  padding: 32rpx $spacing-base;
  text-align: center;
}

.agreement-text {
  font-size: $font-size-xs;
  color: $text-color-disabled;
}
</style>
