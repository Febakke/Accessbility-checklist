export interface WcagRef {
  id: string
  title: string
  url: string
}

export interface ChecklistItem {
  id: string
  title: string
  description: string
  wcagRefs?: WcagRef[]
  howTo?: string
  status?: 'pass' | 'fail' | 'not-tested'
  lastUpdated?: string
}

export interface Category {
  id: string
  title: string
  description: string
  items: ChecklistItem[]
}

export interface Checklist {
  id: string
  title: string
  description: string
  categories: Category[]
} 