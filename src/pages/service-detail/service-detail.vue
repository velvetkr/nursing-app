<template>
  <view class="detail-page" v-if="service">
    <!-- 服务名称 & 价格 -->
    <view class="detail-header">
      <text class="detail-name">{{ service.name }}</text>
      <view class="detail-price">
        <text class="price-num">¥{{ service.price }}</text>
        <text class="price-unit">/{{ service.unit }}</text>
      </view>
      <view class="detail-meta">
        <text class="meta-item">⭐ {{ service.rating }} 分</text>
        <text class="meta-item">{{ service.sales }} 次服务</text>
        <text class="meta-item">⏱ {{ service.duration }}</text>
      </view>
      <view class="detail-tags" v-if="service.tags?.length">
        <text v-for="tag in service.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>
    </view>

    <!-- 服务介绍 -->
    <view class="detail-section">
      <text class="section-title">服务介绍</text>
      <text class="section-content">{{ service.description }}</text>
    </view>

    <!-- 服务范围 -->
    <view class="detail-section" v-if="service.serviceScope?.length">
      <text class="section-title">服务范围</text>
      <view class="scope-list">
        <view v-for="(item, i) in service.serviceScope" :key="i" class="scope-item">
          <u-icon name="checkmark-circle" size="18" color="#52C41A" />
          <text class="scope-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 注意事项 -->
    <view class="detail-section" v-if="service.notice?.length">
      <text class="section-title">注意事项</text>
      <view class="notice-list">
        <view v-for="(item, i) in service.notice" :key="i" class="notice-item">
          <text class="notice-dot">•</text>
          <text class="notice-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="detail-section" v-if="service.reviews?.length">
      <text class="section-title">用户评价 ({{ service.reviews.length }})</text>
      <view v-for="review in service.reviews" :key="review.id" class="review-item">
        <view class="review-header">
          <text class="review-user">{{ review.userName }}</text>
          <text class="review-rating">⭐ {{ review.rating }}</text>
        </view>
        <text class="review-content">{{ review.content }}</text>
        <text class="review-time">{{ review.createTime }}</text>
      </view>
    </view>

    <!-- 底部预约按钮 -->
    <view class="bottom-bar">
      <u-button type="primary" shape="round" size="large" @click="handleBook">
        立即预约
      </u-button>
    </view>
  </view>

  <!-- 加载中 -->
  <view v-else class="loading-page">
    <u-loading-icon size="40" />
    <text class="loading-text">加载中...</text>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useServiceStore } from '@/store/service.js'

const serviceStore = useServiceStore()
const service = ref(null)

onLoad(async (options) => {
  const { id } = options
  if (id) {
    service.value = await serviceStore.fetchServiceDetail(id)
  }
})

function handleBook() {
  uni.showToast({ title: '预约功能将在下单模块中实现', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background-color: $bg-color-grey;
  padding-bottom: 120rpx;
}

.detail-header {
  background-color: $bg-color;
  padding: $spacing-lg $spacing-base;
}

.detail-name {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-color;
  line-height: 1.4;
}

.detail-price {
  margin-top: $spacing-md;
}

.price-num {
  font-size: 52rpx;
  font-weight: 700;
  color: $error-color;
}

.price-unit {
  font-size: $font-size-base;
  color: $text-color-hint;
}

.detail-meta {
  display: flex;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
  color: $text-color-hint;
}

.meta-item {
  margin-right: $spacing-lg;
}

.detail-tags {
  display: flex;
  margin-top: $spacing-sm;
}

.tag {
  font-size: 20rpx;
  color: $primary-color;
  background-color: $primary-bg;
  padding: 4rpx 16rpx;
  border-radius: $radius-sm;
  margin-right: $spacing-sm;
}

.detail-section {
  background-color: $bg-color;
  margin-top: $spacing-sm;
  padding: $spacing-lg $spacing-base;
}

.section-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-color;
  margin-bottom: $spacing-md;
  display: block;
}

.section-content {
  font-size: $font-size-base;
  color: $text-color-secondary;
  line-height: 1.8;
}

.scope-list {
  margin-top: $spacing-sm;
}

.scope-item {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.scope-text {
  font-size: $font-size-base;
  color: $text-color-secondary;
  margin-left: $spacing-sm;
}

.notice-item {
  display: flex;
  margin-bottom: $spacing-sm;
}

.notice-dot {
  color: $warning-color;
  margin-right: $spacing-sm;
  flex-shrink: 0;
}

.notice-text {
  font-size: $font-size-base;
  color: $text-color-secondary;
}

.review-item {
  padding: $spacing-md 0;
  border-bottom: 1rpx solid $border-color-light;

  &:last-child {
    border-bottom: none;
  }
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-user {
  font-size: $font-size-base;
  font-weight: 500;
  color: $text-color;
}

.review-rating {
  font-size: $font-size-sm;
  color: #FAAD14;
}

.review-content {
  display: block;
  font-size: $font-size-base;
  color: $text-color-secondary;
  margin-top: 8rpx;
  line-height: 1.6;
}

.review-time {
  display: block;
  font-size: $font-size-xs;
  color: $text-color-disabled;
  margin-top: 8rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-sm $spacing-base;
  background-color: $bg-color;
  box-shadow: 0 -2rpx 16rpx rgba(0, 0, 0, 0.06);
}

.loading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-text {
  margin-top: $spacing-md;
  font-size: $font-size-base;
  color: $text-color-hint;
}
</style>
