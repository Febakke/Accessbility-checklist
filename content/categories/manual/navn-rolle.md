---
id: navn-rolle
title: 'Alle komponenter har navn og rolle bestemt i koden'
description: 'Test at alle komponenter har korrekt definerte navn og roller'
order: 1
wcagRefs:
  - id: 4.1.2
    title: Navn, rolle, verdi
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value'
---

# Alle komponenter har navn og rolle bestemt i koden

Test at alle komponenter har korrekt definerte navn og roller

## Hvordan teste

1. Inspiser alle interaktive komponenter på siden
2. Sjekk at hver komponent har et tilgjengelig navn (aria-label, aria-labelledby)
3. Verifiser at komponenter har riktig rolle (role-attributt)
4. Test at skjemaelementer har riktig type og tilstand
5. Sjekk at custom komponenter har korrekte ARIA-attributter
6. Verifiser at komponenter fungerer med skjermleser

