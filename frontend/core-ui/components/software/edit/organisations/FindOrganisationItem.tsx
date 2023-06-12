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

  // show path only if different from name (multiple levels)
  let path:string = org.parent_names ?? ''
  if (org.parent_names?.toLowerCase() === org.name.toLowerCase()) {
    path = ''
  }

  return (
    <article
      // information used by e2e tests
      data-testid="organisation-list-item"
      // information used by e2e tests
      data-source={org.source}
      className="flex-1"
      title={org.parent_names}
    >
      <div>
        {org.name}
      </div>
      <div className="text-sm text-base-content-disabled">
        {
          path &&
          <div>{path}</div>
        }
        {
          org.website &&
          <div>{org.website}</div>
        }
        {
          org.ror_id &&
          <div>{org.ror_id}</div>
        }
      </div>
    </article>
  )
}
