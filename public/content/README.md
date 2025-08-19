# Content Structure

Denne mappen inneholder all innhold for tilgjengelighetschecklisten i Markdown-format.

## Mappestruktur

```
content/
├── _config.md                    # Hovedkonfigurasjon for checklisten
├── categories/                   # Kategorier med tester
│   ├── automatic-tools/         # Automatiske verktøy
│   │   ├── _index.md           # Kategori-metadata
│   │   ├── alternative-tekster.md
│   │   ├── input-ledetekster.md
│   │   └── ...
│   ├── keyboard/               # Tastaturnavigasjon
│   ├── screenreader/           # Skjermleser
│   ├── media/                  # Video og lyd
│   ├── contrast/               # Kontraster
│   ├── zoom/                   # Zoom og tekststørrelse
│   ├── mobile/                 # Mobil
│   ├── forms/                  # Skjemaløsninger
│   ├── pointer/                # Pekerenhet
│   └── manual/                 # Manuelle tester
└── sessions/                   # Testresultater (valgfritt)
    └── session-2024-12-19.json
```

## Filformat

### Hovedkonfigurasjon (`_config.md`)
```markdown
---
id: "wcag-checklist-2024"
title: "WCAG Tilgjengelighetstester"
description: "Beskrivelse av checklisten"
createdAt: "2024-04-14T12:00:00Z"
updatedAt: "2024-12-19T10:00:00Z"
---

# Tittel

Innhold...
```

### Kategori (`categories/[kategori]/_index.md`)
```markdown
---
id: "kategori-id"
title: "Kategoritittel"
description: "Beskrivelse av kategorien"
order: 1
---

# Kategoritittel

Beskrivelse av kategorien...
```

### Test-element (`categories/[kategori]/[test-id].md`)
```markdown
---
id: "test-id"
title: "Testtittel"
description: "Beskrivelse av testen"
order: 1
wcagRefs:
  - id: "1.1.1"
    title: "WCAG-krav"
    url: "https://www.w3.org/WAI/WCAG22/Understanding/..."
---

# Testtittel

Beskrivelse av testen.

## Hvordan teste

1. Første steg
2. Andre steg
3. Tredje steg
```

## Konvertering fra JSON

For å konvertere fra den eksisterende JSON-strukturen til Markdown-filer, bruk konverteringsscriptet:

```bash
npm run convert-to-markdown
```

## Validering

For å validere Markdown-strukturen:

```bash
npm run validate-markdown
```
