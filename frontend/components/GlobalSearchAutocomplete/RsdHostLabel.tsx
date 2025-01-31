// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type RsdHostLabelProps=Readonly<{
  hasRemotes: boolean
  hasResults: boolean
  domain?: string | null
  rsd_host?: string | null
}>

export default function RsdHostLabel({hasRemotes,hasResults,domain,rsd_host}:RsdHostLabelProps) {
  let host = '@localhost'

  // we do not show host if no remotes or search results (only shortcuts to modules are shown, software,project etc)
  if (hasRemotes===false || hasResults===false) return null

  if (rsd_host){
    // use rsd_host if value provided
    host = rsd_host
  } else if (domain){
    // extract hostname from domain (if rsd_host is not provided)
    host = `@${new URL(domain).hostname}`
  } else if (typeof window !== 'undefined') {
    // extract hostname from current location (local RSD)
    host = `@${window.location.hostname}`
  }

  return (
    <div className="text-xs text-base-content-secondary line-clamp-1">
      {host}
    </div>
  )
}
