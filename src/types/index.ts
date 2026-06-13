export interface Session {
  id: string;
  date: string;
  location: string;
  weather: string;
  startTime: string;
  endTime: string;
  photos: string[];
  status: 'completed' | 'upcoming';
}

export interface IncomeRecord {
  id: string;
  sessionId: string;
  boothFee: number;
  transportFee: number;
  preparationAmount: number;
  salesVolume: number;
  mobilePayment: number;
  cashIncome: number;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  sold: number;
  restockSuggestion: string;
  priceAdjustmentNote: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  frequentlyAskedQuestions: string[];
  popularDisplays: string[];
  rejectionReasons: string[];
}

export interface Target {
  id: string;
  amount: number;
  deadline: string;
  progress: number;
}

export interface LocationCompare {
  location: string;
  totalIncome: number;
  totalProfit: number;
  avgProfit: number;
  count: number;
}