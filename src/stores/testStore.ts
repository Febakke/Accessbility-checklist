import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TestResult, TestSession, Checklist } from '../types/checklist'

interface TestStore {
  currentSession: TestSession | null
  results: TestResult[]
  currentChecklist: Checklist | null
  
  // Actions
  startNewSession: (checklist?: Checklist) => void
  saveTestResult: (testId: string, status: 'no-issues' | 'found-issues', description?: string) => void
  getTestResult: (testId: string) => TestResult | undefined
  clearSession: () => void
}

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      results: [],
      currentChecklist: null,
      
      startNewSession: (checklist?: Checklist) => {
        console.log('testStore.startNewSession called with:', checklist)
        const sessionId = `session-${Date.now()}`
        const newSession: TestSession = {
          id: sessionId,
          createdAt: new Date().toISOString(),
          results: []
        }
        
        console.log('Creating new session:', newSession)
        set({
          currentSession: newSession,
          results: [],
          currentChecklist: checklist || null
        })
        console.log('Session created successfully')
      },
      
      saveTestResult: (testId: string, status: 'no-issues' | 'found-issues', description?: string) => {
        const { results, currentSession } = get()
        
        // Oppdater eksisterende resultat eller legg til nytt
        const existingIndex = results.findIndex(r => r.testId === testId)
        const newResult: TestResult = {
          testId,
          status,
          description,
          timestamp: new Date().toISOString()
        }
        
        let newResults: TestResult[]
        if (existingIndex >= 0) {
          newResults = [...results]
          newResults[existingIndex] = newResult
        } else {
          newResults = [...results, newResult]
        }
        
        set({ results: newResults })
      },
      
      getTestResult: (testId: string) => {
        const { results } = get()
        return results.find(r => r.testId === testId)
      },
      
      clearSession: () => {
        set({
          currentSession: null,
          results: [],
          currentChecklist: null
        })
      }
    }),
    {
      name: 'test-results-storage'
    }
  )
)




