export type TestCategory = 'automatic' | 'keyboard' | 'screenreader' | 'media' | 'contrast' | 'zoom' | 'mobile' | 'screen-magnifier' | 'pointer' | 'manual'

export type TestStatus = 'pass' | 'fail' | 'not-tested'

export interface ChecklistItem {
  id: string
  slug: string
  title: string
  description: string
  howTo?: string
  category: TestCategory
  wcagRef: string
  status?: TestStatus
  notes?: string
  lastUpdated?: string
}

export interface ChecklistCategory {
  id: string
  title: string
  description: string
  items: ChecklistItem[]
}

export interface Checklist {
  id: string
  title: string
  description: string
  categories: ChecklistCategory[]
  createdAt: string
  updatedAt: string
} 