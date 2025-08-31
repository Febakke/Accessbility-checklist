import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
  testFilters: string[] // Spesifikke test-IDer som skal inkluderes
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
  reapplyFilters: (checklist: Checklist) => void
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
    testFilters: [], // Alle tester
    featureRequirements: {}
  },
  {
    id: 'table-test',
    name: 'Tabell-test',
    description: 'Spesialisert test for tabeller og datapresentasjon',
    categoryFilters: ['manual', 'screenreader'],
    testFilters: [
      'relasjoner', // Semantisk beskrivelse av seksjoner
      'navn-rolle', // Komponenter har navn og rolle
      'overskrifter-landmerker', // Overskrifter og landmerker
      'rekkefolge-innhold', // Rekkefølge på innholdet
      'viktige-bilder' // Ingen bilder av viktige tekster
    ],
    featureRequirements: { hasTables: true }
  },
  {
    id: 'form-test',
    name: 'Skjema-test',
    description: 'Test av skjemaløsninger og validering',
    categoryFilters: ['forms', 'keyboard', 'screenreader'],
    testFilters: [
      'standardformat',
      'feilmelding-identifikasjon',
      'feilmelding-forslag',
      'feilmelding-juridisk',
      'skjemaelement-instruksjoner',
      'obligatoriske-felt',
      'tastatur-funksjonalitet',
      'input-ledetekster',
      'overskrifter-landmerker',
      'tilgjengelig-navn'
    ],
    featureRequirements: { hasForms: true }
  },
  {
    id: 'media-test',
    name: 'Media-test',
    description: 'Test av video, lyd og multimedia-innhold',
    categoryFilters: ['media', 'manual'],
    testFilters: [
      'video-tekstalternativ',
      'video-uten-lyd',
      'video-teksting',
      'lyd-kontroll',
      'pause-stopp',
      'video-synstolking',
      'ingen-auto-oppdatering',
      'ingen-auto-refresh'
    ],
    featureRequirements: { hasVideo: true, hasAudio: true }
  },
  {
    id: 'mobile-test',
    name: 'Mobil-test',
    description: 'Test av mobilvisning og touch-interaksjoner',
    categoryFilters: ['mobile', 'pointer', 'zoom'],
    testFilters: [
      'visningstilpasning',
      'bevegelsesstyring',
      'enkel-pekerinput',
      'forhindre-feilaktig-input',
      'zoom-200',
      'zoom-400',
      'tekstavstand'
    ],
    featureRequirements: { hasMobileVersion: true }
  }
]

export const useTestConfigStore = create<TestConfigStore>()(
  persist(
    (set, get) => ({
  configuration: {
    productFeatures: defaultProductFeatures,
    selectedProfile: null,
    filteredCategories: [],
    filteredItems: []
  },
  availableProfiles: defaultTestProfiles,
  
  updateProductFeatures: (features: Partial<ProductFeatures>) => {
    console.log('updateProductFeatures called with:', features)
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
    console.log('selectProfile called with:', profileId)
    const profile = get().availableProfiles.find(p => p.id === profileId)
    console.log('Found profile:', profile)
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
    
    // Filtrer tester basert på profil og produktets egenskaper
    const filteredItems = filteredCategories.flatMap(category => 
      category.items.filter(item => {
        // Hvis profil har spesifikke testfiltre, bruk disse
        if (selectedProfile && selectedProfile.testFilters.length > 0) {
          return selectedProfile.testFilters.includes(item.id)
        }
        
        // Ellers filtrer basert på produktets egenskaper
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
  },
  
  reapplyFilters: (checklist: Checklist) => {
    const { configuration } = get()
    const { productFeatures, selectedProfile } = configuration
    
    // Hvis vi har lagret state, reapply filters
    if (selectedProfile || Object.values(productFeatures).some(value => value)) {
      console.log('Reapplying filters from persisted state')
      get().applyFilters(checklist)
    }
  }
}),
    {
      name: 'test-config-storage',
      partialize: (state) => ({
        configuration: {
          productFeatures: state.configuration.productFeatures,
          selectedProfile: state.configuration.selectedProfile
        }
      })
    }
  )
)
