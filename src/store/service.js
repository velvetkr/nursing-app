/**
 * Pinia — 服务项目状态管理
 *
 * 管理：服务分类、服务列表、搜索、详情
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/request.js'

export const useServiceStore = defineStore('service', () => {
  // ===== 状态 =====
  const categories = ref([])       // 服务分类列表
  const services = ref([])         // 服务项目列表
  const currentService = ref(null) // 当前查看的服务详情
  const searchKeyword = ref('')    // 搜索关键词
  const activeCategory = ref(null) // 当前选中分类
  const loading = ref(false)

  // ===== 计算属性 =====
  const filteredServices = computed(() => {
    let list = services.value
    if (activeCategory.value) {
      list = list.filter((s) => s.categoryId === activeCategory.value)
    }
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(kw) ||
          (s.description && s.description.toLowerCase().includes(kw))
      )
    }
    return list
  })

  // ===== 方法 =====

  /** 获取服务分类 */
  async function fetchCategories() {
    const res = await http.get('/api/service/categories')
    categories.value = res.data || []
  }

  /** 获取服务列表 */
  async function fetchServices(params = {}) {
    loading.value = true
    try {
      const res = await http.get('/api/service/list', params)
      services.value = res.data || []
    } finally {
      loading.value = false
    }
  }

  /** 获取服务详情 */
  async function fetchServiceDetail(id) {
    const res = await http.get(`/api/service/detail`, { id })
    currentService.value = res.data
    return currentService.value
  }

  /** 搜索服务 */
  function setSearchKeyword(keyword) {
    searchKeyword.value = keyword
  }

  /** 切换分类 */
  function setActiveCategory(categoryId) {
    activeCategory.value = categoryId
  }

  return {
    categories,
    services,
    currentService,
    searchKeyword,
    activeCategory,
    loading,
    filteredServices,
    fetchCategories,
    fetchServices,
    fetchServiceDetail,
    setSearchKeyword,
    setActiveCategory,
  }
})
