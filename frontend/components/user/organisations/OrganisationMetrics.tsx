// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Tooltip from '@mui/material/Tooltip'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'

type OrganisationMetricsProps = {
  readonly software_cnt: number
  readonly project_cnt: number
  // readonly is_tenant: boolean
}

export default function OrganisationMetrics({software_cnt,project_cnt}:OrganisationMetricsProps) {

  function softwareMessage(){
    if (software_cnt && software_cnt === 1) {
      return `${software_cnt} software package`
    }
    return `${software_cnt ?? 0} software packages`
  }

  function projectMessage(){
    if (project_cnt && project_cnt === 1) {
      return `${project_cnt} project`
    }
    return `${project_cnt ?? 0} projects`
  }

  return (
    <>
      <Tooltip title={softwareMessage()} placement="top">
        <div className="flex gap-2 items-center text-base-content-secondary">
          <TerminalIcon sx={{width:20}} />
          <span className="text-sm">{software_cnt ?? 0}</span>
        </div>
      </Tooltip>
      <Tooltip title={projectMessage()} placement="top">
        <div className="flex gap-2 items-center text-base-content-secondary">
          <ListAltIcon sx={{width:20}} />
          <span className="text-sm">{project_cnt ?? 0}</span>
        </div>
      </Tooltip>
    </>
  )
}
