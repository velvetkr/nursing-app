import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '../api/request.js'

export const useComplaintStore = defineStore('adminComplaint', () => {
  const complaints = ref([])
  const currentComplaint = ref(null)
  const total = ref(0)
  const loading = ref(false)

  async function fetchComplaints(params = {}) {
    loading.value = true
    try {
      const res = await http.get('/api/v1/admin/complaints', { params })
      complaints.value = res.data.list || []
      total.value = res.data.total || 0
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchComplaintDetail(id) {
    const res = await http.get(`/api/v1/admin/complaints/${id}`)
    currentComplaint.value = res.data
    return currentComplaint.value
  }

  async function arbitrateComplaint(id, payload) {
    const res = await http.post(`/api/v1/admin/complaints/${id}/arbitrate`, payload, {
      headers: { 'Idempotent-Key': `admin-complaint-${id}-${Date.now()}` },
    })
    currentComplaint.value = res.data
    return currentComplaint.value
  }

  return { complaints, currentComplaint, total, loading, fetchComplaints, fetchComplaintDetail, arbitrateComplaint }
})
