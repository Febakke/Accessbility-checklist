# Nye funksjoner - Filtreringssystem for tilgjengelighetstester

## Oversikt

Dette dokumentet beskriver de nye funksjonene som er lagt til i tilgjengelighetstest-systemet. Hovedfunksjonen er et intelligent filtreringssystem som lar brukere tilpasse testene basert på produktets egenskaper og valgte testprofiler.

## Hovedfunksjoner

### 1. Produktkonfigurasjon

Brukere kan nå spesifisere hva produktet deres inneholder ved å velge fra følgende egenskaper:

- **Video-innhold**: Aktiverer media-tester for video
- **Lyd-innhold**: Aktiverer media-tester for lyd
- **Skjemaer**: Aktiverer skjema-spesifikke tester
- **Tabeller**: Aktiverer tabell-spesifikke tester
- **Bilder og ikoner**: Aktiverer bilde-spesifikke tester
- **Interaktive elementer**: Aktiverer interaksjons-tester
- **Navigasjon**: Aktiverer navigasjons-tester
- **Dynamisk innhold**: Aktiverer dynamisk innhold-tester
- **Mobilversjon**: Aktiverer mobile-spesifikke tester
- **Tastaturnavigasjon**: Aktiverer tastatur-tester

### 2. Testprofiler

Systemet kommer med forhåndsdefinerte testprofiler:

- **Full tilgjengelighetstest**: Alle tilgjengelige tester
- **Tabell-test**: Fokus på tabeller og datapresentasjon
- **Skjema-test**: Fokus på skjemaløsninger og validering
- **Media-test**: Fokus på video, lyd og multimedia-innhold
- **Mobil-test**: Fokus på mobilvisning og touch-interaksjoner

### 3. Intelligent filtrering

Systemet bruker en kombinasjon av:
- Produktets egenskaper
- Valgt testprofil
- Individuelle testkrav

for å automatisk filtrere ut irrelevante tester.



## Teknisk implementering

### Stores

#### `testConfigStore.ts`
Hovedstore for testkonfigurasjon som håndterer:
- Produktets egenskaper
- Valgte testprofiler
- Filtreringslogikk
- Filtrerte resultater

### Komponenter

#### `ProductConfigurator.tsx`
Komponent for å konfigurere produktets egenskaper med checkboxes.

#### `TestProfileSelector.tsx`
Komponent for å velge testprofiler med radio buttons.

#### `FilterSummary.tsx`
Komponent som viser sammendrag av valgte filtre og antall relevante tester.



#### `SystemDocumentation.tsx`
Komponent som dokumenterer hvordan systemet fungerer.

### Filtreringslogikk

```typescript
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
    // ... flere kategorier
  }
})
```

## Brukergrensesnitt

### Hovedside
Den nye forsiden er organisert i tre faner:

1. **Konfigurer test**: Hovedkonfigurasjon med produktegenskaper og testprofiler
2. **Dokumentasjon**: Omfattende dokumentasjon av systemet

### Responsivt design
Alle komponenter er responsive og fungerer godt på både desktop og mobile enheter.

## Fremtidige utvidelser

### Komponent-spesifikke tester
- Tabell-tester
- Skjema-tester
- Navigasjons-tester
- Modal/popup-tester

### Automatisk deteksjon
- Automatisk oppdage produktets egenskaper
- Analyse av HTML-struktur
- Deteksjon av media-elementer

### Lagrede konfigurasjoner
- Lagre produktkonfigurasjoner
- Del konfigurasjoner mellom team
- Import/export av konfigurasjoner

### Rapportgenerering
- Generere rapporter basert på valgte filtre
- Eksportere resultater
- Sammenligne resultater

### Integrasjon
- Integrere med andre verktøy
- API for eksterne systemer
- Webhook-støtte

## Eksempel på bruk

### Scenario 1: Test av en nettside med video
1. Velg "Video-innhold" i produktkonfigurasjonen
2. Velg "Media-test" som testprofil
3. Systemet filtrerer automatisk til relevante tester
4. Start testen med filtrerte tester

### Scenario 2: Test av en skjema-løsning
1. Velg "Skjemaer" i produktkonfigurasjonen
2. Velg "Skjema-test" som testprofil
3. Systemet fokuserer på skjema-spesifikke tester
4. Start testen med relevante tester



## Konfigurasjon

### Standardverdier
```typescript
const defaultProductFeatures = {
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
```

### Testprofiler
Testprofiler kan enkelt utvides ved å legge til nye profiler i `defaultTestProfiles` array.

## Feilhåndtering

Systemet håndterer følgende feilsituasjoner:
- Manglende checklist-data
- Ugyldige testprofiler
- Filtreringsfeil


## Ytelse

Filtreringssystemet er optimalisert for:
- Rask filtrering av store datasets
- Effektiv oppdatering av UI
- Minimal minnebruk
- Responsiv brukeropplevelse
