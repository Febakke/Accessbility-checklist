---
id: synlig-fokusmarkor
title: 'Alle elementer har en visuell markør som blir synlig når du elementet får tastaturfokus'
description: 'Testen feiler om du ikke ser hvilket element som har fokus. Fokusmarkøren skal også ha 3:1 kontrast til bakgrunnen.'
order: 1
wcagRefs:
  - id: 2.4.7
    title: Synlig fokus
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible'
  - id: 1.4.11
    title: Kontrast for ikke-tekstlig innhold
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html'
---

# Alle elementer har en visuell markør som blir synlig når du elementet får tastaturfokus

Testen feiler om du ikke ser hvilket element som har fokus. Fokusmarkøren skal også ha 3:1 kontrast til bakgrunnen.

## Hvordan teste

1. Naviger gjennom siden med Tab-tasten
2. Sjekk at hvert element som får fokus har en tydelig visuell indikator
3. Verifiser at fokusmarkøren har minst 3:1 kontrast mot bakgrunnen
4. Test at fokusmarkøren ikke er skjult av CSS (outline: none)
5. Sjekk at custom fokusmarkører er tilstrekkelig synlige
6. Verifiser at fokusmarkøren fungerer på alle interaktive elementer

