/**
 * Mock — 服务项目模块（分类/列表/详情/搜索）
 */
import Mock from 'mockjs'

const Random = Mock.Random

// ========== 服务分类 ==========
const categories = [
  { id: 'c1', name: '基础护理', icon: '🧑‍⚕️', sort: 1 },
  { id: 'c2', name: '康复理疗', icon: '💪', sort: 2 },
  { id: 'c3', name: '中医养生', icon: '🌿', sort: 3 },
  { id: 'c4', name: '专项护理', icon: '🏥', sort: 4 },
  { id: 'c5', name: '心理慰藉', icon: '💝', sort: 5 },
]

// ========== 服务项目列表 ==========
const serviceList = [
  {
    id: 's1',
    categoryId: 'c1',
    name: '日常起居照料',
    description: '协助老人完成起床、洗漱、穿衣、饮食等日常生活起居，确保生活舒适整洁',
    price: 150,
    unit: '次',
    duration: '2小时',
    rating: 4.8,
    sales: 1280,
    cover: '',
    tags: ['热门', '新客优惠'],
  },
  {
    id: 's2',
    categoryId: 'c1',
    name: '陪同就医',
    description: '专业护理员全程陪同老人就医，协助挂号、取药、记录医嘱，让就医更省心',
    price: 200,
    unit: '次',
    duration: '4小时',
    rating: 4.9,
    sales: 860,
    cover: '',
    tags: ['推荐'],
  },
  {
    id: 's3',
    categoryId: 'c1',
    name: '压疮护理',
    description: '针对长期卧床老人的压疮预防与护理，包括定期翻身、皮肤清洁、敷药换药',
    price: 180,
    unit: '次',
    duration: '1.5小时',
    rating: 4.7,
    sales: 420,
    cover: '',
    tags: [],
  },
  {
    id: 's4',
    categoryId: 'c2',
    name: '康复运动指导',
    description: '专业康复师根据老人身体状况制定运动方案，一对一指导康复训练',
    price: 220,
    unit: '次',
    duration: '1小时',
    rating: 4.6,
    sales: 750,
    cover: '',
    tags: ['热销'],
  },
  {
    id: 's5',
    categoryId: 'c2',
    name: '术后康复护理',
    description: '针对术后恢复期老人的全方位护理，包括切口护理、功能锻炼、营养指导',
    price: 300,
    unit: '次',
    duration: '2小时',
    rating: 4.9,
    sales: 310,
    cover: '',
    tags: ['专业'],
  },
  {
    id: 's6',
    categoryId: 'c2',
    name: '推拿按摩',
    description: '专业推拿师上门提供全身或局部推拿按摩，缓解肌肉酸痛、改善血液循环',
    price: 168,
    unit: '次',
    duration: '1小时',
    rating: 4.5,
    sales: 1560,
    cover: '',
    tags: ['人气'],
  },
  {
    id: 's7',
    categoryId: 'c3',
    name: '艾灸调理',
    description: '传统艾灸疗法，温经通络，调理脏腑，适用于老年人常见慢性病辅助治疗',
    price: 128,
    unit: '次',
    duration: '45分钟',
    rating: 4.7,
    sales: 920,
    cover: '',
    tags: [],
  },
  {
    id: 's8',
    categoryId: 'c3',
    name: '拔罐刮痧',
    description: '中医传统疗法拔罐与刮痧，祛风散寒、活血通络，缓解各种酸痛不适',
    price: 98,
    unit: '次',
    duration: '30分钟',
    rating: 4.3,
    sales: 680,
    cover: '',
    tags: ['性价比'],
  },
  {
    id: 's9',
    categoryId: 'c4',
    name: '静脉采血',
    description: '专业护士上门进行静脉采血，规范操作、安全无菌，免去老人往返医院奔波',
    price: 80,
    unit: '次',
    duration: '30分钟',
    rating: 4.8,
    sales: 2100,
    cover: '',
    tags: ['高频'],
  },
  {
    id: 's10',
    categoryId: 'c4',
    name: 'PICC维护',
    description: '专业护士对PICC置管进行定期维护护理，包括冲管、更换敷料、观察评估',
    price: 260,
    unit: '次',
    duration: '1小时',
    rating: 5.0,
    sales: 340,
    cover: '',
    tags: ['专业', '推荐'],
  },
  {
    id: 's11',
    categoryId: 'c4',
    name: '鼻饲护理',
    description: '为需要鼻饲的老人提供专业鼻饲操作及管道维护，确保营养安全摄入',
    price: 160,
    unit: '次',
    duration: '1小时',
    rating: 4.8,
    sales: 180,
    cover: '',
    tags: [],
  },
  {
    id: 's12',
    categoryId: 'c5',
    name: '心理陪伴聊天',
    description: '专业心理咨询师上门陪伴聊天，缓解老人孤独感、焦虑情绪，提供心理支持',
    price: 150,
    unit: '次',
    duration: '1.5小时',
    rating: 4.6,
    sales: 560,
    cover: '',
    tags: ['暖新'],
  },
]

// ========== 生成更多随机服务 ==========
for (let i = 0; i < 8; i++) {
  const cat = categories[Random.integer(0, categories.length - 1)]
  serviceList.push({
    id: `s_extra_${i}`,
    categoryId: cat.id,
    name: Random.ctitle(4, 8) + '护理服务',
    description: Random.csentence(10, 25),
    price: Random.integer(60, 500),
    unit: '次',
    duration: `${Random.integer(30, 180)}分钟`,
    rating: Random.float(3, 5, 1, 1),
    sales: Random.integer(50, 3000),
    cover: '',
    tags: [],
  })
}

// ========== 工具函数：从 URL 提取 query 参数 ==========
function getQueryParam(url, param) {
  const regex = new RegExp(`[?&]${param}=([^&]*)`)
  const match = url.match(regex)
  return match ? decodeURIComponent(match[1]) : null
}

// ========== 接口 Mock ==========

// 获取服务分类
Mock.mock(/\/api\/service\/categories/, 'get', () => {
  return {
    code: 200,
    data: categories,
    message: '成功',
  }
})

// 获取服务列表（支持分类筛选 + 关键词搜索）
Mock.mock(/\/api\/service\/list/, 'get', (options) => {
  const categoryId = getQueryParam(options.url, 'categoryId')
  const keyword = getQueryParam(options.url, 'keyword')
  let list = [...serviceList]

  if (categoryId) {
    list = list.filter((s) => s.categoryId === categoryId)
  }
  if (keyword) {
    const kw = keyword.toLowerCase()
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(kw) ||
        (s.description && s.description.toLowerCase().includes(kw))
    )
  }

  return {
    code: 200,
    data: list,
    message: '成功',
  }
})

// 获取服务详情
Mock.mock(/\/api\/service\/detail/, 'get', (options) => {
  const id = getQueryParam(options.url, 'id')
  const service = serviceList.find((s) => s.id === id)

  if (!service) {
    return { code: 10004, data: null, message: '服务不存在' }
  }

  // 构造详情页额外信息
  const detail = {
    ...service,
    images: [
      Random.image('750x500', '#4A90D9', '#FFF', service.name),
      Random.image('750x500', '#6BA5E7', '#FFF', service.name),
      Random.image('750x500', '#3570B0', '#FFF', service.name),
    ],
    serviceScope: [
      '服务前会进行健康评估',
      '提供一次性护理用品',
      '服务后可在线评价',
    ],
    notice: [
      '请确保服务期间有人陪同',
      '如有特殊需求请提前备注',
      '取消需提前2小时',
    ],
    reviews: (() => {
      const reviewPool = [
        { name: '张阿姨', rating: 5, content: '护理员非常专业，态度特别好，帮我妈做了全面检查，还耐心教我们日常注意事项，非常满意！', date: '2026-06-20' },
        { name: '李叔叔', rating: 5, content: '老伴卧床两年了，这次护士上门做压疮护理很细心，清理得很干净，比我们自己去医院方便太多了。', date: '2026-06-15' },
        { name: '王女士', rating: 4, content: '康复师经验丰富，给我爸制定了详细的锻炼计划，坚持了一个月已经能看到效果了，会继续预约。', date: '2026-06-10' },
        { name: '赵先生', rating: 5, content: '响应速度很快，下单后半小时就安排好了。护士技术娴熟，采血一次成功，老人一点都不紧张。', date: '2026-06-05' },
        { name: '刘奶奶', rating: 4, content: '子女都在外地，我这腿脚不方便，有了这个平台真的帮了大忙。陪诊的小姑娘很贴心，全程帮我排队取药。', date: '2026-05-28' },
        { name: '陈女士', rating: 5, content: '中医推拿师傅手法很好，我妈妈的肩颈疼了好几个月，按了两次就缓解了很多，价格也公道。', date: '2026-05-20' },
        { name: '周先生', rating: 3, content: '整体服务还可以，就是预约时间有些延迟，希望可以改进调度效率。护理本身是没问题的。', date: '2026-05-15' },
        { name: '孙阿姨', rating: 5, content: '已经是第三次下单了，每次体验都很好。平台上的服务项目越来越丰富，对我们老年人来说真的很实用。', date: '2026-05-10' },
      ]
      const picked = []
      const used = new Set()
      while (picked.length < 3) {
        const r = reviewPool[Math.floor(Math.random() * reviewPool.length)]
        if (!used.has(r.name)) {
          used.add(r.name)
          picked.push({ id: Random.id(), userName: r.name, avatar: '', rating: r.rating, content: r.content, createTime: r.date })
        }
      }
      return picked
    })(),
  }

  return { code: 200, data: detail, message: '成功' }
})
