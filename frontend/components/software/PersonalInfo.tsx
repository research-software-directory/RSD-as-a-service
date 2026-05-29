// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {ReactElement} from 'react'
import OrcidLink from '~/components/layout/OrcidLink'

type PersonalInfoProps = Readonly<{
  role?: string | null
  affiliation?: string | null
  orcid?: string | null
  children?: ReactElement
}>

export default function PersonalInfo({role, affiliation, orcid, children}:PersonalInfoProps) {
  if(role || affiliation || orcid || children){
    return (
      <div className="grid gap-1 pt-1">
        {role ? <div>{role}</div> : null}
        {affiliation ? <div>{affiliation}</div> : null}
        {orcid ? <OrcidLink orcid={orcid} /> : null}
        {children ?? null}
      </div>
    )
  }
  return null
}
