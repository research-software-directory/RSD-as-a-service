// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type AggregatedPersonOptions={
  avatars: string[],
  affiliations: string[],
  roles: string[],
  emails: string[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useAggregatedPerson(orcid:string|null){

  const options:AggregatedPersonOptions = {
    avatars: [],
    affiliations: [],
    emails: [],
    roles: [],
  }

  return {
    loading: false,
    options,
    aggregatedPerson: undefined
  }
}
