// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function CountryLabel({country}: { country: string | null }) {

  return (
    <div
      title={country ?? ''}
      className="h-[1.25rem] line-clamp-1 text-sm text-base-content-secondary font-medium tracking-widest uppercase mb-2"
    >
      {country}
    </div>
  )
}
