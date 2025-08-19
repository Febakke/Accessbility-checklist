---
id: alternative-tekster
title: 'Alternative tekster til bilder, ikoner og illustrasjoner'
description: 'Test at alle bilder, ikoner og illustrasjoner har alternative tekster'
order: 1
wcagRefs:
  - id: 1.1.1
    title: Ikke-tekstlig innhold
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content'
---

# Alternative tekster til bilder, ikoner og illustrasjoner

Test at alle bilder, ikoner og illustrasjoner har alternative tekster

## Hvordan teste

1. Inspiser alle img-elementer på siden
2. Sjekk at hvert bilde har enten alt-attributt eller aria-label
3. For meningsbærende bilder: alt-teksten skal gi samme informasjon som bildet
4. For dekorative bilder: bruk alt="" eller role="presentation"
5. For komplekse bilder: sørg for at det finnes både kort og lang beskrivelse
6. Test med skjermleser at alternative tekster leses opp korrekt

