---
id: input-ledetekster
title: 'Input elementer har en tilhørende label'
description: 'Test at alle input-elementer har tilknyttede ledetekster'
order: 1
wcagRefs:
  - id: 3.3.2
    title: Ledetekster eller instruksjoner
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions'
---

# Input elementer har en tilhørende label

Test at alle input-elementer har tilknyttede ledetekster

## Hvordan teste

1. Inspiser alle input, select, textarea og andre skjemaelementer
2. Sjekk at hvert element har enten:
   - En tilknyttet label-element med for-attributt
   - aria-label eller aria-labelledby
   - title-attributt (som supplement)
3. Verifiser at label-teksten beskriver formålet med input-elementet
4. Test med skjermleser at ledeteksten leses opp når elementet får fokus
5. Sjekk at placeholder-tekst ikke brukes som eneste ledetekst

