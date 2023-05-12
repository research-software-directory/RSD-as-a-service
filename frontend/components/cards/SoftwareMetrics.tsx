// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ContributorIcon from '~/components/icons/ContributorIcon'
import DownloadsIcon from '~/components/icons/DownloadsIcon'
import MentionIcon from '~/components/icons/MentionIcon'

type SoftwareMetricsProps = {
  contributor_cnt?: number | null
  mention_cnt?: number | null
  downloads?: number
}


export default function SoftwareMetrics({contributor_cnt,mention_cnt,downloads}:SoftwareMetricsProps) {
  return (
    <div className="flex gap-5">
      <div className="flex gap-2 items-center">
        <ContributorIcon />
        <span className="text-sm">{contributor_cnt || 0}</span>
      </div>

      <div className="flex gap-2 items-center">
        <MentionIcon />
        <span className="text-sm">{mention_cnt || 0}</span>
      </div>

      {/* TODO Add download counts to the cards */}
      {(downloads && downloads > 0) &&
        <div className="flex gap-2 items-center">
          <DownloadsIcon />
          <span className="text-sm">{downloads}</span>
        </div>
      }
    </div>
  )
}
