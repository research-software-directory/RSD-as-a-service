// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import OrcidLink from '../layout/OrcidLink'

type PersonalInfoProps = Readonly<{
  role?: string | null
  affiliation?: string | null
  orcid?: string | null
}>

export default function PersonalInfo({role, affiliation, orcid}:PersonalInfoProps) {
  if(role || affiliation || orcid){
    return (
      <div className="grid gap-2">
        {role && <div>{role}</div>}
        {affiliation && <div>{affiliation}</div>}
        {orcid && <div><OrcidLink orcid={orcid} /></div>}
      </div>
    )
  }
  return null
}
