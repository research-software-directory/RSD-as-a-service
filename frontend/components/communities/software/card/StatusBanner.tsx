// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CommunityRequestStatus} from '../apiCommunitySoftware'

type StatusBannerProps = {
  status: CommunityRequestStatus
  is_published: boolean
  width?: string
  borderRadius?: string
  letterSpacing?: string
}

export default function StatusBanner({
  status,
  is_published,
  width = '10rem',
  borderRadius = '0 0.5rem 0.5rem 0',
  letterSpacing = '0.125rem'
}: StatusBannerProps) {

  if (status==='rejected') {
    return (
      <div
        className="bg-error text-base-100 px-2 py-1 uppercase font-medium"
        style={{width, borderRadius, letterSpacing}}
      >
        Rejected
      </div>
    )
  }
  if (status==='pending'){
    return (
      <div
        className="bg-warning text-base-100 px-2 py-1 uppercase font-medium"
        style={{width, borderRadius, letterSpacing}}
      >
        Pending
      </div>
    )
  }

  if (is_published === false){
    return (
      <div
        className="bg-base-700 text-base-100 px-2 py-1 uppercase font-medium"
        style={{width, borderRadius, letterSpacing}}
      >
        Not published
      </div>
    )
  }

}
