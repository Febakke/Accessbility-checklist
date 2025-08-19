---
id: ingen-auto-refresh
title: 'Det finnes ingen automatisk refresh eller videresending på siden'
description: 'Test at siden ikke har automatisk oppdatering eller videresending'
order: 1
wcagRefs:
  - id: 2.2.1
    title: Justerbar hastighet
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable'
---

# Det finnes ingen automatisk refresh eller videresending på siden

Test at siden ikke har automatisk oppdatering eller videresending

## Hvordan teste

1. Sjekk om siden har meta refresh-tag i head-seksjonen
2. Inspiser JavaScript-kode for automatisk redirect eller refresh
3. Test at siden ikke automatisk videresender til andre sider
4. Verifiser at eventuelle tidsbegrensninger kan justeres av brukeren
5. Sjekk at brukeren får tilstrekkelig tid til å lese innhold

