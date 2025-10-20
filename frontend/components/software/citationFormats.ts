// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Citation file formats supported by RSD
 */

export type CitationDownloadFormat = {
  [key: string]: {
    label: string
    contentType: string
    ext: string
  }
}

export const citationOptions: CitationDownloadFormat = {
  bibtex: {
    label: 'BibTex',
    contentType: 'application/x-bibtex',
    ext: 'bib'
  },
  codemeta: {
    label: 'CodeMeta',
    contentType: 'application/vnd.codemeta.ld+json',
    ext: 'codemeta.json'
  },
  citeproc: {
    label: 'CSL-JSON',
    contentType: 'application/vnd.citationstyles.csl+json',
    ext: 'csl.json'
  },
  apa: {
    label: 'CSL-APA',
    contentType: 'text/x-bibliography;style=apa',
    ext: 'apa.txt'
  },
  mla: {
    label: 'CSL-MLA',
    contentType: 'text/x-bibliography;style=mla',
    ext: 'mla.txt'
  },
  jats: {
    label: 'JATS',
    contentType: 'application/vnd.jats+xml',
    ext: 'jats.xml'
  },
  ris: {
    label: 'RIS',
    contentType: 'application/x-research-info-systems',
    ext: 'ris'
  },
}

