// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type RorLocationProps = {
  city: string | null
  country: string | null
}

export default function RorLocation({city, country}: RorLocationProps) {
  try {

    if (city === null && country === null) return null

    if (city && country) {
      return <div className="text-base-content-secondary py-1">{city}, {country}</div>
    } else {
      return (
        <div className="text-base-content-secondary uppercase text-sm py-1">
          {country}
        </div>
      )
    }
  } catch (e) {
    return null
  }
}
