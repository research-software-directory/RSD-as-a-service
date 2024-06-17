// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CommunityRequestStatus} from '~/components/communities/software/apiCommunitySoftware'

type CommunityStatusBannerProps = {
  readonly status: CommunityRequestStatus
  readonly width?: string
  readonly borderRadius?: string
  readonly letterSpacing?: string
}

export default function CommunityStatusBanner({
  status,
  width = '100%',
  borderRadius = '0 0.5rem 0.5rem 0',
  letterSpacing = '0.125rem'
}: CommunityStatusBannerProps){

  let classes:string

  switch(status){
    case 'approved':
      classes = 'bg-success'
      break
    case 'rejected':
      classes = 'bg-error'
      break
    default:
      classes = 'bg-warning'
  }

  return (
    <div
      className={`text-base-100 px-2 py-1 uppercase text-[0.75rem] ${classes}`}
      style={{width, borderRadius, letterSpacing}}
    >
      {status}
    </div>
  )
}
