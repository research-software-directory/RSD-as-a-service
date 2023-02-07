// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import {SearchOrganisation} from '../../../../types/Organisation'

export default function FindOrganisationItem({option}: { option: AutocompleteOption<SearchOrganisation> }) {

  function renderSecondRow() {
    return (
      <div className="grid grid-cols-[4fr,3fr] gap-2">
        <div className="break-all" >{
          option.data?.website ??
          <span className="text-base-content-disabled">website url missing</span>
        }</div>
        <div className="pl-4 text-right">{
          option.data?.ror_id ??
          <span className="text-base-content-disabled">ror_id missing</span>
        }</div>
      </div>
    )
  }

  return (
    <article className="flex-1" title={option.data.parent_names}>
      <div className="grid grid-cols-[3fr,1fr] gap-2">
        <div
          data-testid="organisation-list-item-label"
          className="flex items-center">
          <span className="flex-1">{option.label}</span>
        </div>
        <span
          data-testid="organisation-list-item-source"
          className="text-right">
          <strong>{option.data?.source}</strong>
        </span>
      </div>
      <div className="py-1 text-[0.75rem]">
        {renderSecondRow()}
      </div>
    </article>
  )
}
