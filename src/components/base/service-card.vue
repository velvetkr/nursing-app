<template>
  <view class="service-card" @click="handleClick" :class="{ 'has-shadow': shadow }">
    <view class="card-body">
      <view class="card-info">
        <text class="card-name">{{ data.name }}</text>
        <view class="card-tags" v-if="data.tags && data.tags.length">
          <text v-for="tag in data.tags" :key="tag" class="card-tag">{{ tag }}</text>
        </view>
        <text class="card-desc">{{ data.description }}</text>
        <view class="card-meta">
          <text class="card-rating">⭐ {{ data.rating }}</text>
          <text class="card-sales">已售 {{ data.sales }}</text>
          <text class="card-duration" v-if="data.duration">⏱ {{ data.duration }}</text>
        </view>
      </view>
      <view class="card-price">
        <text class="price-num">¥{{ data.price }}</text>
        <text class="price-unit">/{{ data.unit || '次' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
  shadow: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<style lang="scss" scoped>
.service-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  padding: 24rpx;

  &.has-shadow {
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  }

  &:active {
    background-color: #f5f5f5;
  }
}

.card-body {
  display: flex;
  justify-content: space-between;
}

.card-info {
  flex: 1;
  margin-right: 24rpx;
}

.card-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.card-tags {
  display: flex;
  margin-top: 8rpx;
}

.card-tag {
  font-size: 20rpx;
  color: #4A90D9;
  background-color: #EBF4FD;
  padding: 2rpx 12rpx;
  border-radius: 4rpx;
  margin-right: 8rpx;
}

.card-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
  font-size: 20rpx;
  color: #999;
  gap: 24rpx;
}

.card-rating {
  color: #FAAD14;
  font-weight: 500;
}

.card-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 140rpx;
}

.price-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #FF4D4F;
}

.price-unit {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}
</style>
