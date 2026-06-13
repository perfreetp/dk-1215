import type { Session, IncomeRecord, Product, Feedback, Report } from '@/types';

export const mockSessions: Session[] = [
  {
    id: '1',
    date: '2024-01-20',
    location: '静安创意市集',
    weather: '晴',
    startTime: '10:00',
    endTime: '18:00',
    photos: ['https://picsum.photos/id/1082/300/300'],
    status: 'completed'
  },
  {
    id: '2',
    date: '2024-01-21',
    location: '徐汇夜市',
    weather: '多云',
    startTime: '17:00',
    endTime: '22:00',
    photos: [],
    status: 'completed'
  },
  {
    id: '3',
    date: '2024-01-27',
    location: '浦东周末市集',
    weather: '晴',
    startTime: '09:00',
    endTime: '17:00',
    photos: [],
    status: 'upcoming'
  },
  {
    id: '4',
    date: '2024-02-03',
    location: '长宁艺术市集',
    weather: '阴',
    startTime: '10:00',
    endTime: '18:00',
    photos: [],
    status: 'upcoming'
  }
];

export const mockIncomeRecords: IncomeRecord[] = [
  {
    id: '1',
    sessionId: '1',
    boothFee: 300,
    transportFee: 50,
    preparationAmount: 800,
    salesVolume: 45,
    mobilePayment: 1280,
    cashIncome: 320,
    notes: '周末人流量大，比预期好'
  },
  {
    id: '2',
    sessionId: '2',
    boothFee: 200,
    transportFee: 60,
    preparationAmount: 600,
    salesVolume: 32,
    mobilePayment: 960,
    cashIncome: 180,
    notes: '晚间市集，年轻人较多'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '手工陶瓷杯',
    price: 45,
    costPrice: 18,
    stock: 15,
    sold: 8,
    restockSuggestion: '库存充足，暂不需要补货',
    priceAdjustmentNote: '定价合理，销量稳定'
  },
  {
    id: '2',
    name: '香薰蜡烛',
    price: 38,
    costPrice: 15,
    stock: 8,
    sold: 12,
    restockSuggestion: '库存不足，建议补货20个',
    priceAdjustmentNote: '销量很好，可考虑提价5元'
  },
  {
    id: '3',
    name: '手绘明信片',
    price: 12,
    costPrice: 3,
    stock: 50,
    sold: 25,
    restockSuggestion: '库存充足',
    priceAdjustmentNote: '性价比高，保持原价'
  },
  {
    id: '4',
    name: '手工编织包',
    price: 88,
    costPrice: 35,
    stock: 5,
    sold: 3,
    restockSuggestion: '库存较少，建议补货10个',
    priceAdjustmentNote: '价格偏高，考虑促销活动'
  },
  {
    id: '5',
    name: '多肉植物',
    price: 25,
    costPrice: 10,
    stock: 20,
    sold: 15,
    restockSuggestion: '库存适中',
    priceAdjustmentNote: '销量不错，保持原价'
  }
];

export const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    sessionId: '1',
    frequentlyAskedQuestions: [
      '是否可以定制？',
      '材料是什么？',
      '有没有优惠？',
      '能快递吗？'
    ],
    popularDisplays: [
      '灯光照明效果好',
      '产品分类清晰',
      '试用装吸引顾客'
    ],
    rejectionReasons: [
      '价格偏贵',
      '尺寸不合适',
      '颜色选择少'
    ]
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    sessionId: '1',
    totalIncome: 1600,
    totalExpense: 1150,
    profit: 450,
    roi: 0.39,
    bestTimeSlot: '14:00-16:00',
    nextPreparationList: [
      '准备更多香薰蜡烛',
      '制作价目表',
      '带更多零钱',
      '准备优惠活动方案'
    ]
  }
];