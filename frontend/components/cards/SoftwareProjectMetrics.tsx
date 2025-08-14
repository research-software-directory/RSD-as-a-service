// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Tooltip from '@mui/material/Tooltip'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'

import useRsdSettings from '~/config/useRsdSettings'

type SoftwareProjectMetricsProps = Readonly<{
  software_cnt: number | null
  project_cnt: number | null
}>

export default function SoftwareProjectMetrics({software_cnt,project_cnt}:SoftwareProjectMetricsProps) {
  const {activeModules} = useRsdSettings()

  function softwareMessage(){
    if (software_cnt && software_cnt === 1) {
      return `${software_cnt} software package`
    }
    return `${software_cnt ?? 0} software packages`
  }

  function projectMessage(){
    if (project_cnt && project_cnt === 1) {
      return `${project_cnt} research project`
    }
    return `${project_cnt ?? 0} research projects`
  }

  return (
    <>
      {
        activeModules?.includes('software') ?
          <Tooltip title={softwareMessage()} placement="top">
            <div className="flex gap-2 items-center text-base-content-secondary">
              <TerminalIcon sx={{width:20}} />
              <span className="text-sm">{software_cnt ?? 0}</span>
            </div>
          </Tooltip>
          :null
      }
      {
        activeModules?.includes('projects') ?
          <Tooltip title={projectMessage()} placement="top">
            <div className="flex gap-2 items-center text-base-content-secondary">
              <ListAltIcon sx={{width:20}} />
              <span className="text-sm">{project_cnt}</span>
            </div>
          </Tooltip>
          : null
      }
    </>
  )
}
