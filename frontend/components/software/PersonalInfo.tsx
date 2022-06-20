// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
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
  if (role && affiliation && orcid) {
    return (
      <div>
        <div>{role}</div>
        <div>{affiliation}</div>
        <div>
          <a href={'https://orcid.org/' + orcid} target="_blank" rel="noreferrer"
            style={{whiteSpace:'nowrap'}}
          >
            <LogoOrcid className="inline max-w-[1.125rem] mr-1" />
            <span className="text-sm align-bottom">{orcid}</span>
          </a>
        </div>
      </div>
    )
  }

  if (role && affiliation) {
    return (
      <div>
        <div>{role}</div>
        <div>{affiliation}</div>
      </div>
    )
  }

  if (role) {
    return (
      <div>
        {role}
      </div>
    )
  }

  if (affiliation) {
    return (
      <div>
        {affiliation}
      </div>
    )
  }

  return null
}
