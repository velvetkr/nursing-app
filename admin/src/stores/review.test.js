import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useReviewStore } from './review.js'

vi.mock('../api/request.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}))

import http from '../api/request.js'

describe('admin review store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads dashboard and review list', async () => {
    http.get.mockResolvedValueOnce({ data: { pendingTotal: 3 } }).mockResolvedValueOnce({ data: { list: [{ id: 1 }], total: 1 } })
    const store = useReviewStore()
    await store.fetchDashboard()
    await store.fetchReviews('merchant', { status: 'PENDING_REVIEW' })
    expect(http.get).toHaveBeenNthCalledWith(1, '/api/v1/admin/dashboard')
    expect(http.get).toHaveBeenNthCalledWith(2, '/api/v1/admin/reviews/merchant', { params: { status: 'PENDING_REVIEW' } })
    expect(store.total).toBe(1)
  })

  it('submits a dedicated audit action and refreshes dashboard', async () => {
    http.post.mockResolvedValueOnce({ data: { id: 1, status: 'APPROVED' } })
    http.get.mockResolvedValueOnce({ data: { pendingTotal: 0 } })
    const store = useReviewStore()
    await store.auditReview('service', 1, 'approve', '资料核验无误')
    expect(http.post).toHaveBeenCalledWith('/api/v1/admin/reviews/service/1/approve', { reason: '资料核验无误' }, expect.objectContaining({ headers: expect.objectContaining({ 'Idempotent-Key': expect.stringContaining('admin-audit-service-1-') }) }))
    expect(store.currentReview.status).toBe('APPROVED')
  })
})
