import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '../api/request.js'

export const useExceptionStore = defineStore('adminException', () => {
  const exceptions = ref([])
  const currentException = ref(null)
  const total = ref(0)
  const loading = ref(false)

  async function fetchExceptions(params = {}) {
    loading.value = true
    try {
      const res = await http.get('/api/v1/admin/exceptions', { params })
      exceptions.value = res.data.list
      total.value = res.data.total
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchExceptionDetail(id) {
    const res = await http.get(`/api/v1/admin/exceptions/${id}`)
    currentException.value = res.data
    return currentException.value
  }

  async function processException(id, action, remark) {
    const res = await http.post(`/api/v1/admin/exceptions/${id}/${action}`, { remark }, {
      headers: { 'Idempotent-Key': `admin-exception-${id}-${action}-${Date.now()}` },
    })
    currentException.value = res.data
    return currentException.value
  }

  return { exceptions, currentException, total, loading, fetchExceptions, fetchExceptionDetail, processException }
})
