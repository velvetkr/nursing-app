<template>
  <view class="home-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar" @click="goSearch">
      <u-icon name="search" size="20" color="#999" />
      <text class="search-placeholder">搜索护理服务</text>
    </view>

    <!-- Banner 占位 -->
    <view class="banner">
      <view class="banner-content">
        <text class="banner-title">专业护理，温暖到家</text>
        <text class="banner-desc">为老人提供居家护理服务</text>
      </view>
    </view>

    <!-- 服务分类 -->
    <view class="category-section">
      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
        <view class="category-list">
          <view
            v-for="cat in serviceStore.categories"
            :key="cat.id"
            class="category-item"
            :class="{ active: activeCategory === cat.id }"
            @click="onCategoryClick(cat)"
          >
            <text class="category-icon">{{ cat.icon }}</text>
            <text class="category-name">{{ cat.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 服务列表 -->
    <view class="service-section">
      <view class="section-header">
        <text class="section-title">{{ activeCategoryName || '全部服务' }}</text>
        <text class="section-count">共 {{ filteredServices.length }} 个</text>
      </view>

      <!-- 骨架屏 -->
      <view v-if="serviceStore.loading" class="skeleton-list">
        <view v-for="i in 3" :key="i" class="skeleton-card">
          <view class="skeleton-line skeleton-title"></view>
          <view class="skeleton-line skeleton-desc"></view>
          <view class="skeleton-line skeleton-price"></view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="serviceStore.filteredServices.length === 0" class="empty-state">
        <u-icon name="frown" size="80" color="#C0C4CC" />
        <text class="empty-text">暂无相关服务</text>
      </view>

      <!-- 服务卡片列表 -->
      <view v-else class="service-list">
        <view
          v-for="item in serviceStore.filteredServices"
          :key="item.id"
          class="service-card"
          @click="goDetail(item.id)"
        >
          <view class="card-body">
            <view class="card-info">
              <text class="card-name">{{ item.name }}</text>
              <view class="card-tags" v-if="item.tags && item.tags.length">
                <text v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</text>
              </view>
              <text class="card-desc">{{ item.description }}</text>
              <view class="card-meta">
                <text class="card-rating">⭐ {{ item.rating }}</text>
                <text class="card-sales">已售 {{ item.sales }}</text>
                <text class="card-duration">⏱ {{ item.duration }}</text>
              </view>
            </view>
            <view class="card-price">
              <text class="price-num">¥{{ item.price }}</text>
              <text class="price-unit">/{{ item.unit }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useServiceStore } from '@/store/service.js'

const serviceStore = useServiceStore()
const activeCategory = ref(null)

onMounted(async () => {
  await serviceStore.fetchCategories()
  await serviceStore.fetchServices()
})

const activeCategoryName = computed(() => {
  if (!activeCategory.value) return ''
  const cat = serviceStore.categories.find((c) => c.id === activeCategory.value)
  return cat?.name || ''
})

function onCategoryClick(cat) {
  if (activeCategory.value === cat.id) {
    activeCategory.value = null
    serviceStore.setActiveCategory(null)
  } else {
    activeCategory.value = cat.id
    serviceStore.setActiveCategory(cat.id)
  }
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/service-detail/service-detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background-color: $bg-color-grey;
}

.search-bar {
  display: flex;
  align-items: center;
  margin: 16rpx 32rpx;
  padding: 20rpx 24rpx;
  background-color: #fff;
  border-radius: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.search-placeholder {
  margin-left: 16rpx;
  font-size: 28rpx;
  color: #999;
}

.banner {
  margin: 0 32rpx 16rpx;
  padding: 48rpx 32rpx;
  background: linear-gradient(135deg, #4A90D9, #6BA5E7);
  border-radius: 16rpx;
  color: #fff;
}

.banner-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
}

.banner-desc {
  display: block;
  font-size: 24rpx;
  opacity: 0.85;
  margin-top: 8rpx;
}

.category-section {
  background-color: #fff;
  padding: 16rpx 0;
  margin-bottom: 16rpx;
}

.category-list {
  display: flex;
  padding: 0 32rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 24rpx;
  border-radius: 12rpx;
  margin-right: 16rpx;
  min-width: 100rpx;
}

.category-item.active {
  background-color: #EBF4FD;
}

.category-item.active .category-name {
  color: #4A90D9;
  font-weight: 600;
}

.category-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.category-name {
  font-size: 24rpx;
  color: #666;
}

.service-section {
  padding: 0 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.section-count {
  font-size: 24rpx;
  color: #999;
}

.skeleton-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.skeleton-line {
  height: 24rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  border-radius: 4rpx;
  margin-bottom: 16rpx;
}

.skeleton-title { width: 60%; height: 32rpx; }
.skeleton-desc { width: 90%; }
.skeleton-price { width: 30%; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #999;
}

.service-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
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

.card-rating { color: #FAAD14; font-weight: 500; }

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
