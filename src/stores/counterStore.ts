import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  incrementBy: (amount: number) => void
  decrementBy: (amount: number) => void
  setCount: (count: number) => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,

  increment: () => set((state) => ({ count: state.count + 1 })),

  decrement: () => set((state) => ({ count: state.count - 1 })),

  reset: () => set({ count: 0 }),

  incrementBy: (amount: number) => set((state) => ({
    count: state.count + amount
  })),

  decrementBy: (amount: number) => set((state) => ({
    count: state.count - amount
  })),

  setCount: (count: number) => set({ count }),
}))
