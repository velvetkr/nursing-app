import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import http from '../api/request.js'

export const useNotificationStore = defineStore('adminNotification', () => {
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const hasUnread = computed(() => unreadCount.value > 0)

  async function fetchNotifications(params = {}) {
    loading.value = true
    try {
      const res = await http.get('/api/v1/admin/notifications', { params })
      notifications.value = res.data.list || []
      unreadCount.value = res.data.unreadCount || 0
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadCount() {
    const res = await http.get('/api/v1/admin/notifications/unread-count')
    unreadCount.value = res.data.unreadCount || 0
    return unreadCount.value
  }

  async function markAsRead(id) {
    const res = await http.patch(`/api/v1/admin/notifications/${id}/read`)
    const item = notifications.value.find((entry) => entry.notificationId === Number(id))
    if (item && !item.read) { item.read = true; unreadCount.value = Math.max(0, unreadCount.value - 1) }
    return res.data
  }

  async function markAllAsRead() {
    await http.patch('/api/v1/admin/notifications/read-all')
    notifications.value.forEach((item) => { item.read = true })
    unreadCount.value = 0
  }

  return { notifications, unreadCount, loading, hasUnread, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead }
})
