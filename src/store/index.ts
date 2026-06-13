import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Session, IncomeRecord, Product, Feedback, Target, PreparationItem, SessionReport } from '@/types';
import { mockSessions, mockIncomeRecords, mockFeedbacks } from '@/data/mock';

const mockProducts: Product[] = [
  {
    id: 'p1',
    sessionId: '1',
    name: '手工陶瓷杯',
    price: 45,
    costPrice: 18,
    stock: 15,
    sold: 8,
    restockSuggestion: '库存充足，暂不需要补货',
    priceAdjustmentNote: '定价合理，销量稳定'
  },
  {
    id: 'p2',
    sessionId: '1',
    name: '香薰蜡烛',
    price: 38,
    costPrice: 15,
    stock: 8,
    sold: 12,
    restockSuggestion: '库存不足，建议补货20个',
    priceAdjustmentNote: '销量很好，可考虑提价5元'
  },
  {
    id: 'p3',
    sessionId: '1',
    name: '手绘明信片',
    price: 12,
    costPrice: 3,
    stock: 50,
    sold: 25,
    restockSuggestion: '库存充足',
    priceAdjustmentNote: '性价比高，保持原价'
  },
  {
    id: 'p4',
    sessionId: '2',
    name: '手工编织包',
    price: 88,
    costPrice: 35,
    stock: 5,
    sold: 3,
    restockSuggestion: '库存较少，建议补货10个',
    priceAdjustmentNote: '价格偏高，考虑促销活动'
  },
  {
    id: 'p5',
    sessionId: '2',
    name: '多肉植物',
    price: 25,
    costPrice: 10,
    stock: 20,
    sold: 15,
    restockSuggestion: '库存适中',
    priceAdjustmentNote: '销量不错，保持原价'
  }
];

interface State {
  sessions: Session[];
  incomeRecords: IncomeRecord[];
  products: Product[];
  feedbacks: Feedback[];
  currentSessionId: string | null;
  target: Target;
  preparationLists: Map<string, PreparationItem[]>;
  sessionReports: Map<string, SessionReport>;
}

type Action =
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'SET_CURRENT_SESSION'; payload: string | null }
  | { type: 'ADD_INCOME_RECORD'; payload: IncomeRecord }
  | { type: 'UPDATE_INCOME_RECORD'; payload: IncomeRecord }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'ADD_FEEDBACK'; payload: Feedback }
  | { type: 'UPDATE_FEEDBACK'; payload: Feedback }
  | { type: 'SET_TARGET'; payload: Target }
  | { type: 'UPDATE_SESSION_PHOTOS'; payload: { sessionId: string; photos: string[] } }
  | { type: 'UPDATE_PREPARATION_LIST'; payload: { sessionId: string; items: PreparationItem[] } }
  | { type: 'UPDATE_REPORT_CONCLUSION'; payload: { sessionId: string; conclusion: string } };

const initialState: State = {
  sessions: mockSessions,
  incomeRecords: mockIncomeRecords,
  products: mockProducts,
  feedbacks: mockFeedbacks,
  currentSessionId: mockSessions[0]?.id || null,
  target: {
    id: '1',
    amount: 5000,
    deadline: '2024-03-31',
    progress: 0
  },
  preparationLists: new Map(),
  sessionReports: new Map()
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload)
      };
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSessionId: action.payload };
    case 'ADD_INCOME_RECORD':
      return { ...state, incomeRecords: [...state.incomeRecords, action.payload] };
    case 'UPDATE_INCOME_RECORD':
      return {
        ...state,
        incomeRecords: state.incomeRecords.map(i => i.sessionId === action.payload.sessionId ? action.payload : i)
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'ADD_FEEDBACK':
      return { ...state, feedbacks: [...state.feedbacks, action.payload] };
    case 'UPDATE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'SET_TARGET':
      return { ...state, target: action.payload };
    case 'UPDATE_SESSION_PHOTOS':
      return {
        ...state,
        sessions: state.sessions.map(s => 
          s.id === action.payload.sessionId ? { ...s, photos: action.payload.photos } : s
        )
      };
    case 'UPDATE_PREPARATION_LIST':
      return {
        ...state,
        preparationLists: new Map(state.preparationLists).set(action.payload.sessionId, action.payload.items)
      };
    case 'UPDATE_REPORT_CONCLUSION':
      return {
        ...state,
        sessionReports: new Map(state.sessionReports).set(action.payload.sessionId, {
          sessionId: action.payload.sessionId,
          conclusion: action.payload.conclusion
        })
      };
    default:
      return state;
  }
}

interface StoreContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export function useCurrentSession() {
  const { state } = useStore();
  return state.sessions.find(s => s.id === state.currentSessionId) || state.sessions[0];
}

export function useIncomeRecord(sessionId: string) {
  const { state } = useStore();
  return state.incomeRecords.find(i => i.sessionId === sessionId);
}

export function useFeedback(sessionId: string) {
  const { state } = useStore();
  return state.feedbacks.find(f => f.sessionId === sessionId);
}

export function usePreparationList(sessionId: string) {
  const { state } = useStore();
  return state.preparationLists.get(sessionId) || [];
}

export function useSessionProducts(sessionId: string) {
  const { state } = useStore();
  return state.products.filter(p => p.sessionId === sessionId);
}

export function useReportConclusion(sessionId: string) {
  const { state } = useStore();
  return state.sessionReports.get(sessionId)?.conclusion || '';
}