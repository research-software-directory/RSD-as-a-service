// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

export type DataciteRestWork = {
  attributes: {
    doi: string,
    registered: string,
    titles: {
      title: string
    }[]
    creators: {
      name: string,
      givenName: string,
      familyName: string,
    }[],
    contributors: {
      name: string,
      givenName: string,
      familyName: string,
    }[],
    publisher: string,
    publicationYear: number,
    types: {
      resourceTypeGeneral: string,
      resourceType: string,
    }
    version: string,
    relatedIdentifiers: {
      relatedIdentifier: string,
      relatedIdentifierType: string,
    }[]
  },
  relationships: {
    versionOf: {
      data: {
        id: string,
        type: string
      }[]
    }
  }
}

export type DataciteSingleWorkRestResponse = {
  data: DataciteRestWork
}

export type DataciteMultipleWorksRestResponse = {
  data: DataciteRestWork[]
}
