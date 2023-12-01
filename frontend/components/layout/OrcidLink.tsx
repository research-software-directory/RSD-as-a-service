// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import LogoOrcid from '~/assets/logos/logo-orcid.svg'

export default function OrcidLink({orcid}:{orcid?:string|null}) {
  // if no orcid do not show
  if (!orcid) return null
  // construct url
  const url =`https://orcid.org/${orcid}`
  // show orcid link
  return (
    <a href={url} target="_blank" rel="noreferrer"
      style={{whiteSpace:'nowrap'}}
    >
      <LogoOrcid className="inline max-w-[1.125rem] mr-1" />
      <span className="text-sm align-bottom">{orcid}</span>
    </a>
  )
}
