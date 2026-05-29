// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
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
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={{whiteSpace:'nowrap'}}
      className="flex gap-1 items-end"
      // 1. a11y link explanation MUST start with same value as in visible text
      aria-label={`${orcid}, Personal ORCID page, opens in a new tab`}
    >
      {/* 2. SVG hidden from screen readers since it's decorative */}
      <LogoOrcid
        aria-hidden="true"
        className="max-w-[1.5rem]"
      />
      {/* 3. Visible text for everyone */}
      <span className="text-sm">{orcid}</span>
    </a>
  )
}
