import { ref } from 'vue'
import { defineStore } from 'pinia'
import http, { createIdempotentKey } from '@/utils/request.js'

export const useMerchantTeamStore = defineStore('merchantTeam', () => {
  const caregivers = ref([])
  const currentCaregiver = ref(null)
  const members = ref([])
  const summary = ref(null)
  const loading = ref(false)

  async function fetchCaregivers(params = {}) {
    loading.value = true
    try {
      const res = await http.get('/api/v1/merchant/caregivers', params)
      caregivers.value = res.data.list || []
      summary.value = res.data.summary || null
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchCaregiverDetail(relationId) {
    const res = await http.get(`/api/v1/merchant/caregivers/${relationId}`)
    currentCaregiver.value = res.data
    return currentCaregiver.value
  }

  async function inviteCaregiver(payload) {
    const res = await http.post('/api/v1/merchant/caregivers/invite', payload, {
      idempotentKey: createIdempotentKey('invite-caregiver'),
    })
    return res.data
  }

  async function updateCaregiverStatus(relationId, action, reason = '') {
    const res = await http.post(`/api/v1/merchant/caregivers/${relationId}/${action}`, { reason }, {
      idempotentKey: createIdempotentKey(`caregiver-${action}`),
    })
    currentCaregiver.value = res.data
    return res.data
  }

  async function fetchMembers() {
    const res = await http.get('/api/v1/merchant/members')
    members.value = res.data.list || []
    return members.value
  }

  async function inviteMember(payload) {
    const res = await http.post('/api/v1/merchant/members/invite', payload, {
      idempotentKey: createIdempotentKey('invite-member'),
    })
    members.value.unshift(res.data)
    return res.data
  }

  async function updateMemberStatus(memberId, action) {
    const res = await http.post(`/api/v1/merchant/members/${memberId}/${action}`, null, {
      idempotentKey: createIdempotentKey(`member-${action}`),
    })
    const index = members.value.findIndex((item) => item.memberId === memberId)
    if (index >= 0) members.value[index] = res.data
    return res.data
  }

  return { caregivers, currentCaregiver, members, summary, loading, fetchCaregivers, fetchCaregiverDetail, inviteCaregiver, updateCaregiverStatus, fetchMembers, inviteMember, updateMemberStatus }
})
