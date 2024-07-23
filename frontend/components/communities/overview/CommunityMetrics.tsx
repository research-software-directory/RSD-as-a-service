// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Tooltip from '@mui/material/Tooltip'
import TerminalIcon from '@mui/icons-material/Terminal'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'

type CommunityMetricsProps = {
  software_cnt: number
  pending_cnt: number | null
}

export default function CommunityMetrics({software_cnt,pending_cnt}:CommunityMetricsProps) {

  function softwareMessage(){
    if (software_cnt && software_cnt === 1) {
      return `${software_cnt} software package`
    }
    return `${software_cnt ?? 0} software packages`
  }

  function pendingMessage(){
    if (pending_cnt && pending_cnt === 1) {
      return `${pending_cnt} request to join`
    }
    return `${pending_cnt ?? 0} requests to join`
  }

  return (
    <>
      <Tooltip title={softwareMessage()} placement="top">
        <div className="flex gap-2 items-center text-base-content-secondary">
          <TerminalIcon sx={{width:20}} />
          <span className="text-sm">{software_cnt ?? 0}</span>
        </div>
      </Tooltip>
      {
        pending_cnt !== null &&
        <Tooltip title={pendingMessage()} placement="top">
          <div className="flex gap-2 items-center text-base-content-secondary">
            <FlagOutlinedIcon sx={{width:20}} />
            <span className="text-sm">{pending_cnt}</span>
          </div>
        </Tooltip>
      }
    </>
  )
}
