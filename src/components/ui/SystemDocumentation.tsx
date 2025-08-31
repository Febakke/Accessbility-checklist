import React from 'react'
import { Heading, Details } from '@digdir/designsystemet-react'

interface SystemDocumentationProps {
  className?: string
}

export function SystemDocumentation({ className }: SystemDocumentationProps) {
  return (
    <div className={className}>
      <Heading level={2} data-size="lg">
        Hvordan fungerer filtreringssystemet?
      </Heading>
      
      <Details>
        <Details.Summary>Produktets egenskaper</Details.Summary>
        <Details.Content>
          <p>
            Ved å velge hva produktet ditt inneholder, kan systemet automatisk 
            filtrere ut irrelevante tester. For eksempel:
          </p>
          <ul>
            <li><strong>Video-innhold:</strong> Aktiverer media-tester for video</li>
            <li><strong>Lyd-innhold:</strong> Aktiverer media-tester for lyd</li>
            <li><strong>Skjemaer:</strong> Aktiverer skjema-spesifikke tester</li>
            <li><strong>Tabeller:</strong> Aktiverer tabell-spesifikke tester</li>
            <li><strong>Mobilversjon:</strong> Aktiverer mobile-spesifikke tester</li>
          </ul>
        </Details.Content>
      </Details>
      
      <Details>
        <Details.Summary>Testprofiler</Details.Summary>
        <Details.Content>
          <p>
            Testprofiler er forhåndsdefinerte sett av tester som er tilpasset 
            spesifikke bruksområder:
          </p>
          <ul>
            <li><strong>Full test:</strong> Alle tilgjengelige tester</li>
            <li><strong>Tabell-test:</strong> Fokus på tabeller og datapresentasjon</li>
            <li><strong>Skjema-test:</strong> Fokus på skjemaløsninger</li>
            <li><strong>Media-test:</strong> Fokus på video og lyd</li>
            <li><strong>Mobil-test:</strong> Fokus på mobilvisning</li>
          </ul>
        </Details.Content>
      </Details>
      
      <Details>
        <Details.Summary>Filtreringslogikk</Details.Summary>
        <Details.Content>
          <p>
            Systemet bruker en kombinasjon av produktets egenskaper og valgt 
            testprofil for å bestemme hvilke tester som skal inkluderes:
          </p>
          <ol>
            <li>Hvis en testprofil er valgt, brukes dens kategorifiltre</li>
            <li>Ellers filtreres basert på produktets egenskaper</li>
            <li>Individuelle tester filtreres basert på produktets egenskaper</li>
            <li>Resultatet vises i testoppsummeringen</li>
          </ol>
        </Details.Content>
      </Details>
      

      
      <Details>
        <Details.Summary>Fremtidige utvidelser</Details.Summary>
        <Details.Content>
          <p>
            Systemet er designet for å være utvidbart. Fremtidige muligheter inkluderer:
          </p>
          <ul>
            <li><strong>Komponent-spesifikke tester:</strong> For tabeller, skjemaer, navigasjon, etc.</li>
            <li><strong>Automatisk deteksjon:</strong> Automatisk oppdage produktets egenskaper</li>
            <li><strong>Lagrede konfigurasjoner:</strong> Lagre og gjenbruk produktkonfigurasjoner</li>
            <li><strong>Rapportgenerering:</strong> Generere rapporter basert på valgte filtre</li>
            <li><strong>Integrasjon:</strong> Integrere med andre verktøy og systemer</li>
          </ul>
        </Details.Content>
      </Details>
    </div>
  )
}
