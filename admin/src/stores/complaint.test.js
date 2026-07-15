import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useComplaintStore } from './complaint.js'

vi.mock('../api/request.js', () => ({ default: { get: vi.fn(), post: vi.fn() } }))
import http from '../api/request.js'

describe('admin complaint store', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })
  it('loads arbitration queue', async () => {
    http.get.mockResolvedValueOnce({ data: { list: [{ complaintId: 1 }], total: 1 } })
    const store = useComplaintStore(); await store.fetchComplaints({ status: 4 })
    expect(http.get).toHaveBeenCalledWith('/api/v1/admin/complaints', { params: { status: 4 } })
  })
  it('submits arbitration decision idempotently', async () => {
    http.post.mockResolvedValueOnce({ data: { complaintId: 1, status: 2 } })
    const store = useComplaintStore(); await store.arbitrateComplaint(1, { decision: 'PARTIAL_REFUND', refundAmount: 30, remark: '核验完成' })
    expect(http.post).toHaveBeenCalledWith('/api/v1/admin/complaints/1/arbitrate', expect.objectContaining({ decision: 'PARTIAL_REFUND' }), expect.objectContaining({ headers: expect.any(Object) }))
  })
})
