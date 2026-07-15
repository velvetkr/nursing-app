import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '../api/request.js'

export const useReviewStore = defineStore('adminReview', () => {
  const dashboard = ref(null)
  const reviews = ref([])
  const currentReview = ref(null)
  const total = ref(0)
  const loading = ref(false)

  async function fetchDashboard() {
    const res = await http.get('/api/v1/admin/dashboard')
    dashboard.value = res.data
    return dashboard.value
  }

  async function fetchReviews(type, params = {}) {
    loading.value = true
    try {
      const res = await http.get(`/api/v1/admin/reviews/${type}`, { params })
      reviews.value = res.data.list
      total.value = res.data.total
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchReviewDetail(type, id) {
    const res = await http.get(`/api/v1/admin/reviews/${type}/${id}`)
    currentReview.value = res.data
    return currentReview.value
  }

  async function auditReview(type, id, action, reason) {
    const res = await http.post(`/api/v1/admin/reviews/${type}/${id}/${action}`, { reason }, {
      headers: { 'Idempotent-Key': `admin-audit-${type}-${id}-${Date.now()}` },
    })
    currentReview.value = res.data
    const index = reviews.value.findIndex((item) => item.id === Number(id))
    if (index >= 0) reviews.value[index] = { ...reviews.value[index], ...res.data }
    await fetchDashboard()
    return currentReview.value
  }

  return { dashboard, reviews, currentReview, total, loading, fetchDashboard, fetchReviews, fetchReviewDetail, auditReview }
})
