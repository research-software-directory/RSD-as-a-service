// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Tooltip from '@mui/material/Tooltip'
import ImpactIcon from '~/components/icons/ImpactIcon'
import MentionIcon from '~/components/icons/MentionIcon'

type ProjectMetricsProps = {
  impact_cnt?: number | null
  output_cnt?: number | null
}


export default function ProjectMetrics({impact_cnt, output_cnt}: ProjectMetricsProps) {

  function impactCntMessage() {
    if (impact_cnt && impact_cnt === 1) {
      return `${impact_cnt} impact reference`
    }
    return `${impact_cnt} impact references`
  }

  function outputCntMessage() {
    if (output_cnt && output_cnt === 1) {
      return `${output_cnt} research output`
    }
    return `${output_cnt} research outputs`
  }

  return (
    <>
      <Tooltip title={impactCntMessage()} placement="top">
        <div className="flex gap-2 items-center">
          <ImpactIcon />
          <span className="text-sm">{impact_cnt ?? 0}</span>
        </div>
      </Tooltip>
      <Tooltip title={outputCntMessage()} placement="top">
        <div className="flex gap-2 items-center">
          <MentionIcon />
          <span className="text-sm">{output_cnt ?? 0}</span>
        </div>
      </Tooltip>
    </>
  )
}
