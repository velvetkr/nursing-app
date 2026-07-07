<template>
  <view class="service-page">
    <!-- 搜索栏 -->
    <view class="search-bar" @click="goSearch">
      <u-icon name="search" size="20" color="#999" />
      <text class="search-placeholder">搜索护理服务</text>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
      <scroll-view scroll-x :show-scrollbar="false">
        <view class="tab-list">
          <view
            v-for="cat in categories"
            :key="cat.id"
            class="tab-item"
            :class="{ active: serviceStore.activeCategory === cat.id }"
            @click="onCategoryChange(cat.id)"
          >
            <text class="tab-text">{{ cat.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 服务列表 -->
    <view class="service-list">
      <view
        v-for="item in serviceStore.filteredServices"
        :key="item.id"
        class="service-card"
        @click="goDetail(item.id)"
      >
        <view class="card-body">
          <view class="card-info">
            <text class="card-name">{{ item.name }}</text>
            <text class="card-desc">{{ item.description }}</text>
            <view class="card-meta">
              <text class="card-rating">⭐ {{ item.rating }}</text>
              <text class="card-sales">{{ item.sales }} 次服务</text>
              <text class="card-duration">⏱ {{ item.duration }}</text>
            </view>
          </view>
          <view class="card-price">
            <text class="price-num">¥{{ item.price }}</text>
            <text class="price-unit">/{{ item.unit }}</text>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more">
        <text class="load-text">— 已加载全部服务 —</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useServiceStore } from '@/store/service.js'

const serviceStore = useServiceStore()
const { categories, services } = serviceStore

onMounted(async () => {
  if (!categories.value.length) {
    await serviceStore.fetchCategories()
  }
  if (!services.value.length) {
    await serviceStore.fetchServices()
  }
})

function onCategoryChange(categoryId) {
  // 点击已选中的分类则取消筛选，回到全部
  if (serviceStore.activeCategory === categoryId) {
    serviceStore.setActiveCategory(null)
  } else {
    serviceStore.setActiveCategory(categoryId)
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
.service-page {
  min-height: 100vh;
  background-color: $bg-color-grey;
}

.search-bar {
  display: flex;
  align-items: center;
  margin: $spacing-md $spacing-base;
  padding: $spacing-sm $spacing-md;
  background-color: $bg-color;
  border-radius: $radius-lg;
}

.search-placeholder {
  margin-left: $spacing-sm;
  font-size: $font-size-base;
  color: $text-color-hint;
}

.category-tabs {
  background-color: $bg-color;
  padding: $spacing-sm 0;
}

.tab-list {
  display: flex;
  padding: 0 $spacing-base;
}

.tab-item {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-round;
  margin-right: $spacing-sm;
  background-color: $bg-color-grey;

  &.active {
    background-color: $primary-color;

    .tab-text {
      color: #fff;
    }
  }
}

.tab-text {
  font-size: $font-size-sm;
  color: $text-color-secondary;
  white-space: nowrap;
}

.service-list {
  padding: $spacing-sm $spacing-base;
}

.service-card {
  background: $bg-color;
  border-radius: $radius-md;
  margin-bottom: $spacing-sm;
  padding: $card-padding;
  box-shadow: $shadow-sm;
}

.card-body {
  display: flex;
  justify-content: space-between;
}

.card-info {
  flex: 1;
  margin-right: $spacing-md;
}

.card-name {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-color;
}

.card-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: $font-size-sm;
  color: $text-color-secondary;
  margin-top: 8rpx;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
  font-size: $font-size-xs;
  color: $text-color-hint;
}

.card-rating {
  color: #FAAD14;
}

.card-sales, .card-duration {
  margin-left: $spacing-md;
}

.card-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.price-num {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $error-color;
}

.price-unit {
  font-size: $font-size-xs;
  color: $text-color-hint;
}

.load-more {
  text-align: center;
  padding: $spacing-lg 0;
}

.load-text {
  font-size: $font-size-sm;
  color: $text-color-disabled;
}
</style>
