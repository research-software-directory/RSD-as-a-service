// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import OrganisationsFilter, {OrganisationOption} from '~/components/filter/OrganisationsFilter'
import useQueryChange from '../useQueryChange'

type OrganisationFilterProps = {
  organisations: string[],
  organisationsList: OrganisationOption[]
}

export default function OrgProjectOrganisationsFilter({organisations, organisationsList}: OrganisationFilterProps) {
  const {handleQueryChange} = useQueryChange()

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
