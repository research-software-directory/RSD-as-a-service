// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import {SearchContributor} from '../../../../types/Contributor'

export default function FindContributorItem({option}: { option: AutocompleteOption<SearchContributor> }) {

  function renderSecondRow() {
    const {affiliation,orcid,institution} = option.data
    // debugger
    if (affiliation && orcid) {
      return (
        <div className="grid grid-cols-[3fr,2fr] gap-2">
          <div>{affiliation}</div>
          <div className="pl-4 text-right">{orcid}</div>
        </div>
      )
    }
    if (institution && institution.length > 0 && orcid) {
      return (
        <div className="grid grid-cols-[3fr,2fr] gap-2">
          {institution.join('; ')}
          <div className="pl-4 text-right">{orcid}</div>
        </div>
      )
    }
    if (orcid) {
      return (
        <div className="grid grid-cols-[3fr,2fr] gap-2">
          <div className="flex-1"></div>
          <div className="pl-4 text-right">{option.data?.orcid}</div>
        </div>
      )
    }
    if (affiliation) {
      return (
        <div className="flex-1">
          {option.data?.affiliation}
        </div>
      )
    }
    if (institution) {
      return (
        <div className="flex-1">
          {institution.join('; ')}
        </div>
      )
    }
  }

  return (
    <article className="flex-1">
      <div className="grid grid-cols-[3fr,1fr] gap-2">
        <div className="flex items-center">
          <strong><span className="flex-1">{option.label}</span></strong>
        </div>
        <span className="text-right">{option.data?.source}</span>
      </div>
      <div className="py-1 text-[0.75rem]">
        {renderSecondRow()}
      </div>
    </article>
  )
}
