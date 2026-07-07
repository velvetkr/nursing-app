<template>
  <view class="skeleton-list">
    <view v-for="i in count" :key="i" class="skeleton-card">
      <view class="skeleton-line skeleton-title"></view>
      <view class="skeleton-line skeleton-desc"></view>
      <view class="skeleton-line skeleton-short"></view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 3 },
})
</script>

<style lang="scss" scoped>
.skeleton-list {
  padding: 0;
}

.skeleton-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.skeleton-line {
  height: 24rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4rpx;
  margin-bottom: 16rpx;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-title { width: 60%; height: 32rpx; }
.skeleton-desc { width: 90%; }
.skeleton-short { width: 35%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
