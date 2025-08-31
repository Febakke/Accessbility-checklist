import { create } from 'zustand'
import type { Checklist, Category, ChecklistItem } from '../types/checklist'

export interface ProductFeatures {
  hasVideo: boolean
  hasAudio: boolean
  hasForms: boolean
  hasTables: boolean
  hasImages: boolean
  hasInteractiveElements: boolean
  hasNavigation: boolean
  hasDynamicContent: boolean
  hasMobileVersion: boolean
  hasKeyboardNavigation: boolean
}

export interface TestProfile {
  id: string
  name: string
  description: string
  categoryFilters: string[]
  featureRequirements: Partial<ProductFeatures>
}

export interface TestConfiguration {
  productFeatures: ProductFeatures
  selectedProfile: TestProfile | null
  filteredCategories: Category[]
  filteredItems: ChecklistItem[]
}

interface TestConfigStore {
  configuration: TestConfiguration
  availableProfiles: TestProfile[]
  
  // Actions
  updateProductFeatures: (features: Partial<ProductFeatures>) => void
  selectProfile: (profileId: string) => void
  resetConfiguration: () => void
  applyFilters: (checklist: Checklist) => void
  getFilteredChecklist: (checklist: Checklist) => Checklist
}

const defaultProductFeatures: ProductFeatures = {
  hasVideo: false,
  hasAudio: false,
  hasForms: false,
  hasTables: false,
  hasImages: true,
  hasInteractiveElements: true,
  hasNavigation: true,
  hasDynamicContent: false,
  hasMobileVersion: false,
  hasKeyboardNavigation: true
}

const defaultTestProfiles: TestProfile[] = [
  {
    id: 'full-test',
    name: 'Full tilgjengelighetstest',
    description: 'Komplett test av alle WCAG-krav',
    categoryFilters: [],
    featureRequirements: {}
  },
  {
    id: 'table-test',
    name: 'Tabell-test',
    description: 'Spesialisert test for tabeller og datapresentasjon',
    categoryFilters: ['manual', 'screenreader'],
    featureRequirements: { hasTables: true }
  },
  {
    id: 'form-test',
    name: 'Skjema-test',
    description: 'Test av skjemaløsninger og validering',
    categoryFilters: ['forms', 'keyboard', 'screenreader'],
    featureRequirements: { hasForms: true }
  },
  {
    id: 'media-test',
    name: 'Media-test',
    description: 'Test av video, lyd og multimedia-innhold',
    categoryFilters: ['media', 'manual'],
    featureRequirements: { hasVideo: true, hasAudio: true }
  },
  {
    id: 'mobile-test',
    name: 'Mobil-test',
    description: 'Test av mobilvisning og touch-interaksjoner',
    categoryFilters: ['mobile', 'pointer', 'zoom'],
    featureRequirements: { hasMobileVersion: true }
  }
]

export const useTestConfigStore = create<TestConfigStore>((set, get) => ({
  configuration: {
    productFeatures: defaultProductFeatures,
    selectedProfile: null,
    filteredCategories: [],
    filteredItems: []
  },
  availableProfiles: defaultTestProfiles,
  
  updateProductFeatures: (features: Partial<ProductFeatures>) => {
    set(state => ({
      configuration: {
        ...state.configuration,
        productFeatures: {
          ...state.configuration.productFeatures,
          ...features
        }
      }
    }))
  },
  
  selectProfile: (profileId: string) => {
    const profile = get().availableProfiles.find(p => p.id === profileId)
    set(state => ({
      configuration: {
        ...state.configuration,
        selectedProfile: profile || null
      }
    }))
  },
  
  resetConfiguration: () => {
    set({
      configuration: {
        productFeatures: defaultProductFeatures,
        selectedProfile: null,
        filteredCategories: [],
        filteredItems: []
      }
    })
  },
  
  applyFilters: (checklist: Checklist) => {
    const { configuration } = get()
    const { productFeatures, selectedProfile } = configuration
    
    console.log('applyFilters called with:', { productFeatures, selectedProfile })
    
    // Filtrer kategorier basert på produktets egenskaper
    const filteredCategories = checklist.categories.filter(category => {
      // Hvis ingen profil er valgt, vis alle kategorier
      if (!selectedProfile) return true
      
      // Hvis profil har spesifikke kategorifiltre, bruk disse
      if (selectedProfile.categoryFilters.length > 0) {
        return selectedProfile.categoryFilters.includes(category.id)
      }
      
      // Ellers filtrer basert på produktets egenskaper
      switch (category.id) {
        case 'media':
          return productFeatures.hasVideo || productFeatures.hasAudio
        case 'forms':
          return productFeatures.hasForms
        case 'mobile':
          return productFeatures.hasMobileVersion
        case 'keyboard':
          return productFeatures.hasKeyboardNavigation
        case 'pointer':
          return productFeatures.hasInteractiveElements
        case 'zoom':
          return productFeatures.hasDynamicContent
        default:
          return true
      }
    })
    
    // Filtrer tester basert på produktets egenskaper
    const filteredItems = filteredCategories.flatMap(category => 
      category.items.filter(item => {
        // Filtrer basert på produktets egenskaper
        if (item.id.includes('video') && !productFeatures.hasVideo) return false
        if (item.id.includes('audio') && !productFeatures.hasAudio) return false
        if (item.id.includes('form') && !productFeatures.hasForms) return false
        if (item.id.includes('table') && !productFeatures.hasTables) return false
        if (item.id.includes('mobile') && !productFeatures.hasMobileVersion) return false
        
        return true
      })
    )
    
    // Hvis ingen profil er valgt, vis alle tester fra filtrerte kategorier
    const finalFilteredItems = selectedProfile ? filteredItems : filteredCategories.flatMap(category => category.items)
    
    console.log('Filtering results:', { 
      totalCategories: checklist.categories.length,
      filteredCategories: filteredCategories.length,
      totalItems: checklist.categories.flatMap(c => c.items).length,
      filteredItems: finalFilteredItems.length
    })
    
    set(state => ({
      configuration: {
        ...state.configuration,
        filteredCategories,
        filteredItems: finalFilteredItems
      }
    }))
  },
  
  getFilteredChecklist: (checklist: Checklist) => {
    const { configuration } = get()
    const { filteredCategories } = configuration
    
    return {
      ...checklist,
      categories: filteredCategories
    }
  }
}))
