// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function RsdHostLabel({rsd_host,domain}:Readonly<{rsd_host?:string|null,domain?:string|null}>){

  if (!rsd_host) return null

  return (
    <div
      title={domain ?? rsd_host}
      className="line-clamp-1 text-sm text-base-content-secondary tracking-widest mb-2"
    >
      {rsd_host}
    </div>
  )
}
