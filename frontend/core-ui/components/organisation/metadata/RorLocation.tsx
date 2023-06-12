// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import PlaceIcon from '@mui/icons-material/Place'
import {RORItem} from '~/utils/getROR'
import UnderlinedTitle from './UnderlinedTitle'

export default function RorLocation({meta}: { meta: RORItem | null }) {
  try {
    if (meta===null) return null
    const location = meta.addresses[0]
    if (location) {
      const country = meta.country.country_name
      const {lng,lat} = location
      if (lng && lat) {
        const query = encodeURIComponent(`${meta.name},${location.city},${country}`)
        return (
          <>
            <UnderlinedTitle title='Location' />
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              passHref
              target="_blank"
            >
              <div className="flex gap-2">
                <PlaceIcon sx={{
                  width: '1.5rem',
                  height: '1.5rem'
                }} />
                <div>
                  <div>{meta.name}</div>
                  <div>{location.city}, {country}</div>
                </div>
              </div>
            </Link>
          </>
        )
      }
      return null
    }
    return null
  } catch (e) {
    return null
  }
}
