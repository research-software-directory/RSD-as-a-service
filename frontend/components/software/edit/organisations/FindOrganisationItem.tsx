// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type FindOrganisationItemProps = {
  name: string,
  ror_id: string | null
  website: string | null,
  parent_names?: string
  source: string,
}

export default function FindOrganisationItem({...org}:FindOrganisationItemProps) {

  function renderSecondRow() {
    return (
      <div className="grid grid-cols-[4fr,3fr] gap-2">
        <div className="break-all" >{
          org.website ??
          <span className="text-base-content-disabled">website url missing</span>
        }</div>
        <div className="pl-4 text-right">{
          org.ror_id ??
          <span className="text-base-content-disabled">ror_id missing</span>
        }</div>
      </div>
    )
  }

  return (
    <article className="flex-1" title={org.parent_names}>
      <div className="grid grid-cols-[3fr,1fr] gap-2">
        <div
          data-testid="organisation-list-item-label"
          className="flex items-center">
          <span className="flex-1">{org.name}</span>
        </div>
        <span
          data-testid="organisation-list-item-source"
          className="text-right">
          <strong>{org.source}</strong>
        </span>
      </div>
      <div className="py-1 text-[0.75rem]">
        {renderSecondRow()}
      </div>
    </article>
  )
}
