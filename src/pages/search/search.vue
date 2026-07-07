<template>
  <view class="search-page">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="search-input-wrap">
        <u-icon name="search" size="18" color="#999" />
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索护理服务..."
          focus
          @confirm="onSearch"
        />
        <u-icon
          v-if="keyword"
          name="close-circle-fill"
          size="18"
          color="#C0C4CC"
          @click="clearSearch"
        />
      </view>
      <text class="search-cancel" @click="goBack">取消</text>
    </view>

    <!-- 搜索历史 -->
    <view v-if="!keyword && history.length" class="history-section">
      <view class="history-header">
        <text class="history-title">搜索历史</text>
        <u-icon name="trash" size="18" color="#999" @click="clearHistory" />
      </view>
      <view class="history-list">
        <text
          v-for="(item, index) in history"
          :key="index"
          class="history-tag"
          @click="onHistoryClick(item)"
        >
          {{ item }}
        </text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-if="keyword" class="result-section">
      <!-- 搜索中 -->
      <view v-if="searching" class="searching">
        <u-loading-icon size="24" />
        <text class="searching-text">搜索中...</text>
      </view>

      <!-- 空结果 -->
      <view v-else-if="results.length === 0" class="empty-result">
        <u-icon name="frown" size="60" color="#C0C4CC" />
        <text class="empty-title">未找到相关服务</text>
        <text class="empty-desc">换个关键词试试吧</text>
      </view>

      <!-- 结果列表 -->
      <view v-else class="result-list">
        <text class="result-count">找到 {{ results.length }} 个相关服务</text>
        <view
          v-for="item in results"
          :key="item.id"
          class="result-card"
          @click="goDetail(item.id)"
        >
          <view class="card-info">
            <text class="card-name" v-html="highlight(item.name)"></text>
            <text class="card-desc" v-html="highlight(item.description || '')"></text>
            <view class="card-meta">
              <text class="card-rating">⭐ {{ item.rating }}</text>
              <text class="card-price">¥{{ item.price }}/{{ item.unit }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import http from '@/utils/request.js'

const keyword = ref('')
const results = ref([])
const searching = ref(false)
const history = ref(JSON.parse(uni.getStorageSync('searchHistory') || '[]'))

function onSearch() {
  const kw = keyword.value.trim()
  if (!kw) return

  // 保存搜索历史
  if (!history.value.includes(kw)) {
    history.value.unshift(kw)
    if (history.value.length > 10) history.value.pop()
    uni.setStorageSync('searchHistory', JSON.stringify(history.value))
  }

  doSearch(kw)
}

async function doSearch(kw) {
  searching.value = true
  try {
    const res = await http.get('/api/service/list', { keyword: kw })
    results.value = res.data || []
  } catch {
    results.value = []
  } finally {
    searching.value = false
  }
}

function onHistoryClick(item) {
  keyword.value = item
  onSearch()
}

function clearSearch() {
  keyword.value = ''
  results.value = []
}

function clearHistory() {
  history.value = []
  uni.removeStorageSync('searchHistory')
}

function goBack() {
  uni.navigateBack()
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/service-detail/service-detail?id=${id}` })
}

function highlight(text) {
  if (!keyword.value) return text
  const reg = new RegExp(keyword.value, 'gi')
  return text.replace(reg, (match) => `<text style="color:#4A90D9;font-weight:600;">${match}</text>`)
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background-color: $bg-color-grey;
}

.search-header {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-base;
  background-color: $bg-color;
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: $bg-color-grey;
  border-radius: $radius-round;
  padding: $spacing-sm $spacing-md;
}

.search-input {
  flex: 1;
  margin: 0 $spacing-sm;
  font-size: $font-size-base;
  color: $text-color;
}

.search-cancel {
  font-size: $font-size-base;
  color: $text-color-secondary;
  margin-left: $spacing-md;
  flex-shrink: 0;
}

.history-section {
  background-color: $bg-color;
  padding: $spacing-md $spacing-base;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.history-title {
  font-size: $font-size-base;
  font-weight: 500;
  color: $text-color;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
}

.history-tag {
  font-size: $font-size-sm;
  color: $text-color-secondary;
  background-color: $bg-color-grey;
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-round;
  margin-right: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.result-section {
  padding: $spacing-sm $spacing-base;
}

.searching {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.searching-text {
  margin-left: $spacing-sm;
  font-size: $font-size-base;
  color: $text-color-hint;
}

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-title {
  font-size: $font-size-md;
  color: $text-color-secondary;
  margin-top: $spacing-md;
}

.empty-desc {
  font-size: $font-size-sm;
  color: $text-color-hint;
  margin-top: $spacing-xs;
}

.result-count {
  font-size: $font-size-sm;
  color: $text-color-hint;
  margin-bottom: $spacing-sm;
  display: block;
}

.result-card {
  background: $bg-color;
  border-radius: $radius-base;
  padding: $spacing-md;
  margin-bottom: $spacing-sm;
}

.card-name {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-color;
}

.card-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  font-size: $font-size-sm;
  color: $text-color-secondary;
  margin-top: 8rpx;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
}

.card-rating {
  font-size: $font-size-xs;
  color: #FAAD14;
}

.card-price {
  font-size: $font-size-base;
  font-weight: 600;
  color: $error-color;
}
</style>
