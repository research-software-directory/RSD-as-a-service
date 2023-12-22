// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import useProjectOverviewParams from '../useProjectOverviewParams'
import OrganisationsFilter from '~/components/filter/OrganisationsFilter'

export type OrganisationOption = {
  organisation: string,
  organisation_cnt: number
}

type OrganisationFilterProps = {
  organisations: string[],
  organisationsList: OrganisationOption[]
}

export default function ProjectOrganisationsFilter({organisations, organisationsList}: OrganisationFilterProps) {
  const {handleQueryChange} = useProjectOverviewParams()

  return (
    <div>
      <OrganisationsFilter
        organisations={organisations}
        organisationsList={organisationsList}
        handleQueryChange={handleQueryChange}
      />
    </div>
  )
}
