// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import ContributorAvatar from '~/components/software/ContributorAvatar'
import {AggregatedPerson} from './groupByOrcid'

export default function AggregatedPersonOption({option}: {option: AutocompleteOption<AggregatedPerson>}) {

  const displayName = getDisplayName(option.data)
  const displayInitials = getDisplayInitials(option.data)

  function renderSecondRow() {
    const {affiliation_options,orcid} = option.data
    // debugger
    if (affiliation_options && affiliation_options.length > 0 && orcid) {
      return (
        <div className="grid grid-cols-[3fr_2fr] gap-2">
          {affiliation_options.join('; ')}
          <div
            className="pl-4 text-right"
            aria-label={`ORCID ID ${orcid}`}>
            {orcid}
          </div>
        </div>
      )
    }
    if (orcid) {
      return (
        <div className="grid grid-cols-[3fr_2fr] gap-2">
          <div className="flex-1"></div>
          <div
            className="pl-4 text-right"
            aria-label={`ORCID ID ${orcid}`}>
            {orcid}
          </div>
        </div>
      )
    }
    if (affiliation_options) {
      return (
        <div className="flex-1">
          {affiliation_options.join('; ')}
        </div>
      )
    }
  }

  return (
    <div className="flex-1 flex gap-2">
      <ContributorAvatar
        avatarUrl={getImageUrl(option.data?.avatar_options[0] ?? null) ?? ''}
        displayName={displayName ?? ''}
        displayInitials={displayInitials}
      />
      <div className="flex-1">
        <div className="grid grid-cols-[3fr_1fr] gap-2">
          <div className="flex items-center">
            <strong><span className="flex-1">{option.label}</span></strong>
          </div>
          <span
            className="text-right"
            aria-label={`Source ${option.data?.sources.join(', ')}`}
          >{option.data?.sources.join(', ')}</span>
        </div>
        <div className="py-1 text-[0.75rem]">
          {renderSecondRow()}
        </div>
      </div>
    </div>
  )
}
