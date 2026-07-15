import Mock from 'mockjs'

Mock.setup({ timeout: '180-420' })

const adminUser = { adminId: 1, name: '林审核员', roleName: '平台超级管理员', permissions: ['*'] }

const reviewData = {
  merchant: [
    createReview(90002, 'merchant', '安心到家护理服务中心', '商户申请人', 'MR202607130002', '企业主体及经营资质入驻申请', '2026-07-15 09:10', [
      field('商户类型', '护理服务机构'), field('统一社会信用代码', '91110105MA02AX2026'), field('法定代表人', '周安心'), field('负责人', '周安心 · 138****8004'), field('经营地址', '北京市朝阳区安和街16号', true), field('服务区域', '北京市朝阳区、海淀区', true), field('经营范围', '居家生活照护、陪诊陪护和康复护理协助。', true),
    ], [{ name: '营业执照', type: '执照', number: '91110105MA02AX2026' }, { name: '养老服务机构备案回执', type: '许可', number: 'CYBA-2026-0318' }]),
    createReview(90003, 'merchant', '颐康居家养老服务有限公司', '张经理', 'MR202607140003', '养老服务机构入驻申请', '2026-07-14 16:40', [field('商户类型', '养老服务机构'), field('统一社会信用代码', '91110108MA03YK2026'), field('法定代表人', '张颐康'), field('负责人', '张经理 · 139****2208'), field('经营地址', '北京市海淀区颐和路66号', true), field('服务区域', '北京市海淀区、西城区', true)], [{ name: '营业执照', type: '执照', number: '91110108MA03YK2026' }, { name: '养老机构备案回执', type: '许可', number: 'HDBA-2026-0186' }]),
    createProcessedReview(90001, 'merchant', '康宁护理中心', '赵康宁', 'MR202602270001', '企业主体、营业执照和经营许可核验通过', '2026-02-27 09:30', 'APPROVED'),
  ],
  caregiver: [
    createReview(80005, 'caregiver', '刘佳宁', '刘佳宁', 'CR202607150005', '5年从业经验 · 生活照护、术后护理', '2026-07-15 08:30', [field('身份证号', '1101011993********'), field('从业年限', '5年'), field('服务区域', '北京市朝阳区、东城区', true), field('服务技能', '生活照护、术后护理、用药指导', true), field('个人简介', '具备养老护理员职业技能等级证书，熟悉术后老人照护。', true)], [{ name: '养老护理员职业技能等级证书', type: '证书', number: 'YLHL-2021-0086', validUntil: '2031-08-30' }]),
    createReview(80006, 'caregiver', '孙静', '孙静', 'CR202607140006', '3年从业经验 · 陪诊陪护、康复护理', '2026-07-14 17:15', [field('身份证号', '1101011995********'), field('从业年限', '3年'), field('服务区域', '北京市海淀区', true), field('服务技能', '陪诊陪护、康复护理', true)], [{ name: '护士执业证书', type: '证书', number: 'NURSE-2023-0715', validUntil: '2028-07-15' }]),
    createProcessedReview(80001, 'caregiver', '王护理员', '测试用户', 'CR202603100001', '身份及证书核验通过', '2026-03-10 09:20', 'APPROVED'),
  ],
  service: [
    createReview(600, 'service', '专业伤口换药护理', '康宁护理中心', 'SR202607150600', '上门伤口评估、清洁和规范换药 · 2个服务规格', '2026-07-15 08:40', [field('服务分类', '医疗护理'), field('服务商户', '康宁护理中心'), field('价格区间', '¥168 - ¥298'), field('服务时长', '60 - 90分钟'), field('服务说明', '由具备资质的护理人员上门进行伤口评估、清洁和规范换药。', true), field('风险提示', '急性大出血、伤口严重感染等情况建议立即就医。', true)], [{ name: '服务封面与图文详情', type: '内容', number: '2张图片' }, { name: '护理资质要求', type: '规则', number: '护士执业证书' }]),
    createReview(601, 'service', '术后康复护理指导', '康宁护理中心', 'SR202607150601', '术后康复评估与居家训练指导 · 3个服务规格', '2026-07-15 09:25', [field('服务分类', '康复护理'), field('服务商户', '康宁护理中心'), field('价格区间', '¥199 - ¥499'), field('服务时长', '60 - 120分钟'), field('服务说明', '结合术后阶段提供安全的居家康复训练指导。', true)], [{ name: '服务封面与图文详情', type: '内容', number: '3张图片' }]),
    createProcessedReview(599, 'service', '居家用药清单整理', '康宁护理中心', 'SR202607130599', '服务说明不完整，已驳回修改', '2026-07-13 15:20', 'REJECTED'),
  ],
}

function field(label, value, wide = false) { return { label, value, wide } }
function createReview(id, type, subjectName, applicantName, referenceNo, summary, submitTime, fields, documents) { return { id, type, subjectName, applicantName, referenceNo, summary, submitTime, status: 'PENDING_REVIEW', fields, documents, records: [{ id: `${id}-submit`, action: 'SUBMIT', title: '提交平台审核', remark: '申请资料已提交，等待平台审核。', operator: applicantName, time: submitTime }] } }
function createProcessedReview(id, type, subjectName, applicantName, referenceNo, summary, submitTime, status) { const review = createReview(id, type, subjectName, applicantName, referenceNo, summary, submitTime, [field('资料摘要', summary, true)], [{ name: '主体资料附件', type: '附件', number: referenceNo }]); review.status = status; review.auditReason = status === 'APPROVED' ? '资料核验无误，同意通过' : '资料不完整，请补充后重新提交'; review.auditTime = '2026-07-14 16:20'; review.auditorName = '林审核员'; review.records.unshift({ id: `${id}-audit`, action: status === 'APPROVED' ? 'APPROVE' : 'REJECT', title: status === 'APPROVED' ? '审核通过' : '审核驳回', remark: review.auditReason, operator: review.auditorName, time: review.auditTime }); return review }

function allReviews() { return Object.values(reviewData).flat() }
function dashboard() { const pending = { merchant: 0, caregiver: 0, service: 0 }; allReviews().forEach((item) => { if (item.status === 'PENDING_REVIEW') pending[item.type] += 1 }); const priorityQueue = allReviews().filter((item) => item.status === 'PENDING_REVIEW').sort((a, b) => a.submitTime.localeCompare(b.submitTime)).slice(0, 6); return { pending, pendingTotal: Object.values(pending).reduce((sum, value) => sum + value, 0), processedToday: allReviews().filter((item) => item.status !== 'PENDING_REVIEW').length, priorityQueue } }

Mock.mock(/\/api\/v1\/admin\/login$/, 'post', (options) => { const body = JSON.parse(options.body || '{}'); if (!['admin', '13800138999'].includes(body.account) || body.password !== '123456') return { code: 2010, message: '管理员账号或密码错误', data: null }; return { code: 0, message: '登录成功', data: { token: `mock_admin_${Date.now()}`, user: adminUser } } })
Mock.mock(/\/api\/v1\/admin\/dashboard$/, 'get', () => ({ code: 0, message: 'success', data: dashboard() }))
Mock.mock(/\/api\/v1\/admin\/reviews\/(merchant|caregiver|service)(?:\?|$)/, 'get', (options) => { const type = options.url.match(/reviews\/(merchant|caregiver|service)/)?.[1]; const url = new URL(options.url, 'http://mock.local'); const status = url.searchParams.get('status') || ''; const keyword = (url.searchParams.get('keyword') || '').toLowerCase(); const page = Number(url.searchParams.get('page') || 1); const size = Number(url.searchParams.get('size') || 10); let list = reviewData[type] || []; if (status) list = list.filter((item) => item.status === status); if (keyword) list = list.filter((item) => `${item.subjectName}${item.applicantName}${item.referenceNo}`.toLowerCase().includes(keyword)); return { code: 0, message: 'success', data: { list: list.slice((page - 1) * size, page * size), total: list.length, page, size } } })
Mock.mock(/\/api\/v1\/admin\/reviews\/(merchant|caregiver|service)\/\d+$/, 'get', (options) => { const [, type, id] = options.url.match(/reviews\/(merchant|caregiver|service)\/(\d+)/) || []; const review = reviewData[type]?.find((item) => item.id === Number(id)); return review ? { code: 0, message: 'success', data: review } : { code: 1005, message: '审核任务不存在', data: null } })
Mock.mock(/\/api\/v1\/admin\/reviews\/(merchant|caregiver|service)\/\d+\/(approve|reject)$/, 'post', (options) => { const [, type, id, action] = options.url.match(/reviews\/(merchant|caregiver|service)\/(\d+)\/(approve|reject)/) || []; const review = reviewData[type]?.find((item) => item.id === Number(id)); if (!review) return { code: 1005, message: '审核任务不存在', data: null }; if (review.status !== 'PENDING_REVIEW') return { code: 1006, message: '该任务已被处理', data: null }; const body = JSON.parse(options.body || '{}'); review.status = action === 'approve' ? 'APPROVED' : 'REJECTED'; review.auditReason = body.reason || (action === 'approve' ? '资料核验无误，同意通过' : '资料不完整，请修改后重新提交'); review.auditTime = new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'); review.auditorName = adminUser.name; review.records.unshift({ id: `${review.id}-${Date.now()}`, action: action === 'approve' ? 'APPROVE' : 'REJECT', title: action === 'approve' ? '审核通过' : '审核驳回', remark: review.auditReason, operator: adminUser.name, time: review.auditTime }); return { code: 0, message: '审核完成', data: review } })

console.log('[Admin Mock] 管理端审核数据已启用')
