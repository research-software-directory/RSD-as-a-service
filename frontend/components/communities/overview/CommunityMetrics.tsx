// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Tooltip from '@mui/material/Tooltip'
import TerminalIcon from '@mui/icons-material/Terminal'

type CommunityMetricsProps = {
  software_cnt: number
}

export default function CommunityMetrics({software_cnt}:CommunityMetricsProps) {

  function softwareMessage(){
    if (software_cnt && software_cnt === 1) {
      return `${software_cnt} software package`
    }
    return `${software_cnt ?? 0} software packages`
  }

  return (
    <>
      <Tooltip title={softwareMessage()} placement="top">
        <div className="flex gap-2 items-center text-base-content-secondary">
          <TerminalIcon sx={{width:20}} />
          <span className="text-sm">{software_cnt ?? 0}</span>
        </div>
      </Tooltip>
    </>
  )
}
