// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import OpenInNewIcon from '@mui/icons-material/OpenInNew'

/**
 * It requires parent element to have tailwind "relative" class.
 * It requires parent element to have tailwind "group" class for changing to primary color on hover.
 * If domain is not provided or null it returns null/nothing.
 * @param domain string
 * @returns JSX.Element | null
 */
export default function ExternalLinkIcon({domain}:Readonly<{domain?:string|null}>) {
  if (domain){
    return (
      <div
        title={domain}
        className="absolute right-0 top-0 p-2 z-1 rounded-tr-md opacity-40 bg-base-100 group-hover:bg-primary group-hover:opacity-70 group-hover:text-primary-content">
        <OpenInNewIcon sx={{width:'1.5rem', height: '1.5rem'}} />
      </div>
    )
  }
  return null
}
