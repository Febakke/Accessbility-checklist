---
id: ingen-tastaturfelle
title: 'Du kan gå fra start til slutt uten å bli sittende fast'
description: 'Det er ingen tastaturfeller som gjør at brukeren ikke kommer seg ut uten å bruke andre hjelpemidler enn tastatur. Husk å teste på tooltips, menyer og andre komponenter som streker seg utover "vanlig" html funksjonalitet.'
order: 1
wcagRefs:
  - id: 2.1.2
    title: Ingen tastaturfelle
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap'
---

# Du kan gå fra start til slutt uten å bli sittende fast

Det er ingen tastaturfeller som gjør at brukeren ikke kommer seg ut uten å bruke andre hjelpemidler enn tastatur. Husk å teste på tooltips, menyer og andre komponenter som streker seg utover "vanlig" html funksjonalitet.

## Hvordan teste

1. Naviger til alle interaktive elementer med Tab-tasten
2. Test at du kan komme deg ut av alle modaler, dropdown-meny og popup-vinduer
3. Verifiser at Escape-tasten fungerer for å lukke overlappende innhold
4. Sjekk at du ikke blir låst inne i karuseller eller slideshows
5. Test at alle custom komponenter kan navigeres ut av
6. Verifiser at ingen JavaScript-kode fanger opp og blokkerer tastaturinput

