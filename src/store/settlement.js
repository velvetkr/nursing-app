import { ref } from 'vue'
import { defineStore } from 'pinia'
import http, { createIdempotentKey } from '@/utils/request.js'

export const useSettlementStore = defineStore('settlement', () => {
  const caregiverEarnings = ref(null)
  const merchantSettlements = ref(null)
  const loading = ref(false)

  async function fetchCaregiverEarnings() {
    loading.value = true
    try { const res = await http.get('/api/v1/caregiver/earnings'); caregiverEarnings.value = res.data; return res.data } finally { loading.value = false }
  }

  async function applyCaregiverWithdrawal(payload) {
    const res = await http.post('/api/v1/caregiver/withdrawals', payload, { idempotentKey: createIdempotentKey('caregiver-withdraw') })
    await fetchCaregiverEarnings()
    return res.data
  }

  async function fetchMerchantSettlements() {
    loading.value = true
    try { const res = await http.get('/api/v1/merchant/settlements'); merchantSettlements.value = res.data; return res.data } finally { loading.value = false }
  }

  async function applyMerchantWithdrawal(payload) {
    const res = await http.post('/api/v1/merchant/withdrawals', payload, { idempotentKey: createIdempotentKey('merchant-withdraw') })
    await fetchMerchantSettlements()
    return res.data
  }

  return { caregiverEarnings, merchantSettlements, loading, fetchCaregiverEarnings, applyCaregiverWithdrawal, fetchMerchantSettlements, applyMerchantWithdrawal }
})
