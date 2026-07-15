import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import http, { createIdempotentKey } from '@/utils/request.js'
import { CAREGIVER_AUDIT_STATUS } from '@/constants/caregiver-status.js'

export const useCaregiverStore = defineStore('caregiver', () => {
  const application = ref(null)
  const profile = ref(null)
  const loading = ref(false)

  const auditStatus = computed(() => application.value?.auditStatus || CAREGIVER_AUDIT_STATUS.NOT_APPLIED)
  const canEditApplication = computed(() => [
    CAREGIVER_AUDIT_STATUS.NOT_APPLIED,
    CAREGIVER_AUDIT_STATUS.DRAFT,
    CAREGIVER_AUDIT_STATUS.REJECTED,
  ].includes(auditStatus.value))

  async function fetchApplication() {
    loading.value = true
    try {
      const res = await http.get('/api/v1/caregivers/application')
      application.value = res.data || null
      return application.value
    } finally {
      loading.value = false
    }
  }

  async function saveApplication(payload) {
    const res = await http.put('/api/v1/caregivers/application', payload)
    application.value = res.data
    return application.value
  }

  async function submitApplication(payload) {
    const res = await http.post('/api/v1/caregivers/apply', payload, {
      idempotentKey: createIdempotentKey('caregiver-apply'),
    })
    application.value = res.data
    return application.value
  }

  async function fetchProfile() {
    const res = await http.get('/api/v1/caregiver/profile')
    profile.value = res.data
    return profile.value
  }

  return {
    application,
    profile,
    loading,
    auditStatus,
    canEditApplication,
    fetchApplication,
    saveApplication,
    submitApplication,
    fetchProfile,
  }
})

