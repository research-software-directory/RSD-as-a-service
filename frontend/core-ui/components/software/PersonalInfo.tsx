// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import LogoOrcid from '~/assets/logos/logo-orcid.svg'

type PersonalInfoProps = {
  role?: string | null
  affiliation?: string | null
  orcid?: string | null
}

export default function PersonalInfo({role, affiliation, orcid}:PersonalInfoProps) {
  if(!(role || affiliation || orcid)) return null

  return (
    <div>
      {role && <div>{role}</div>}
      {affiliation && <div>{affiliation}</div>}
      {orcid && <div>
        <a href={'https://orcid.org/' + orcid} target="_blank" rel="noreferrer"
          style={{whiteSpace:'nowrap'}}
        >
          <LogoOrcid className="inline max-w-[1.125rem] mr-1" />
          <span className="text-sm align-bottom">{orcid}</span>
        </a>
      </div>}
    </div>
  )
}
