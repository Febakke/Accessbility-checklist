import { create } from 'zustand'
import { loadChecklistFromFiles, clearCache } from '../utils/markdownParser'
import type { Checklist, Category, ChecklistItem } from '../types/checklist'

interface ChecklistStore {
  checklist: Checklist | null
  loading: boolean
  error: string | null
  
  // Actions
  loadChecklist: () => Promise<void>
  getCategory: (categoryId: string) => Category | undefined
  getTest: (categoryId: string, testId: string) => ChecklistItem | undefined
  clearError: () => void
  refresh: () => Promise<void>
}

export const useChecklistStore = create<ChecklistStore>((set, get) => ({
  checklist: null,
  loading: false,
  error: null,
  
  loadChecklist: async () => {
    set({ loading: true, error: null })
    
    try {
      const checklist = await loadChecklistFromFiles()
      set({ checklist, loading: false })
    } catch (error) {
      console.error('Feil ved lasting av checklist:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Ukjent feil ved lasting av checklist',
        loading: false 
      })
    }
  },
  
  getCategory: (categoryId: string) => {
    const { checklist } = get()
    return checklist?.categories.find(cat => cat.id === categoryId)
  },
  
  getTest: (categoryId: string, testId: string) => {
    const { checklist } = get()
    const category = checklist?.categories.find(cat => cat.id === categoryId)
    return category?.items.find(item => item.id === testId)
  },
  
  clearError: () => {
    set({ error: null })
  },
  
  refresh: async () => {
    clearCache()
    await get().loadChecklist()
  }
}))
