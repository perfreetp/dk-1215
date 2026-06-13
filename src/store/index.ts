import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Session, IncomeRecord, Product, Feedback, Target, PreparationItem } from '@/types';
import { mockSessions, mockIncomeRecords, mockProducts, mockFeedbacks } from '@/data/mock';

interface State {
  sessions: Session[];
  incomeRecords: IncomeRecord[];
  products: Product[];
  feedbacks: Feedback[];
  currentSessionId: string | null;
  target: Target;
  preparationLists: Map<string, PreparationItem[]>;
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
  | { type: 'UPDATE_PREPARATION_LIST'; payload: { sessionId: string; items: PreparationItem[] } };

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
  preparationLists: new Map()
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