// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {OrganisationStatus} from '~/types/Organisation'

type StatusBannerProps = {
  status: OrganisationStatus
  is_featured: boolean
  is_published: boolean
  width?: string
  borderRadius?: string
  letterSpacing?: string
}

export default function StatusBanner({
  status,
  is_featured,
  is_published,
  width = '10rem',
  borderRadius = '0 0.5rem 0.5rem 0',
  letterSpacing = '0.125rem'
}: StatusBannerProps) {
  return (
    <>
      {status !== 'approved' &&
        <div
          className="bg-error text-base-100 px-2 py-1 uppercase font-medium"
          style={{width, borderRadius, letterSpacing}}
        >
          Blocked
        </div>
      }
      {is_featured &&
        <div
          className="bg-primary text-base-100 px-2 py-1 uppercase font-medium"
          style={{width, borderRadius, letterSpacing}}
        >
          Pinned
        </div>
      }
      {is_published === false &&
        <div
          className="bg-base-700 text-base-100 px-2 py-1 uppercase font-medium"
          style={{width, borderRadius, letterSpacing}}
        >
          Not published
        </div>
      }
    </>
  )
}
