import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '@/utils/request.js'
import { normalizeOrderState } from '@/constants/order-status.js'
import { USE_MOCK_API, unavailableApi } from '@/constants/api-capabilities.js'

export const useMerchantStore = defineStore('merchant', () => {
  const dashboard = ref(null)
  const orders = ref([])
  const currentOrder = ref(null)
  const total = ref(0)
  const loading = ref(false)
  const exceptions = ref([])

  async function fetchDashboard() {
    if (!USE_MOCK_API) {
      dashboard.value = {
        merchantName: '', waitingDispatch: 0, waitingAccept: 0, todayServices: 0,
        inService: 0, totalOrders: 0, completed: 0, monthRevenue: 0, exceptionCount: 0,
      }
      return dashboard.value
    }
    const res = await http.get('/api/v1/merchants/dashboard')
    dashboard.value = res.data
    return dashboard.value
  }

  async function fetchOrders(params = {}) {
    if (!USE_MOCK_API) {
      orders.value = []
      total.value = 0
      throw unavailableApi('商户订单列表')
    }
    loading.value = true
    try {
      const res = await http.get('/api/v1/merchants/orders', {
        page: params.page || 1,
        size: params.size || 20,
        ...(params.orderStatus ? { orderStatus: params.orderStatus } : {}),
        ...(params.assignmentStatus ? { assignmentStatus: params.assignmentStatus } : {}),
        ...(params.keyword ? { keyword: params.keyword } : {}),
      })
      orders.value = (res.data?.list || []).map(normalizeOrderState)
      total.value = res.data?.total || 0
      return { list: orders.value, total: total.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderDetail(orderId) {
    if (!USE_MOCK_API) throw unavailableApi('商户订单详情')
    loading.value = true
    try {
      const res = await http.get(`/api/v1/merchants/orders/${orderId}`)
      currentOrder.value = normalizeOrderState(res.data)
      return currentOrder.value
    } finally {
      loading.value = false
    }
  }

  async function fetchExceptions(params = {}) {
    if (!USE_MOCK_API) {
      exceptions.value = []
      return { list: [] }
    }
    const res = await http.get('/api/v1/merchant/exceptions', params)
    exceptions.value = res.data?.list || []
    return res.data
  }

  return {
    dashboard,
    orders,
    currentOrder,
    total,
    loading,
    exceptions,
    fetchDashboard,
    fetchOrders,
    fetchOrderDetail,
    fetchExceptions,
  }
})
