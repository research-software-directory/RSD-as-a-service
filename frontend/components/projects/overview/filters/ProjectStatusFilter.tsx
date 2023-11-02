// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import {ProjectStatusKey} from '~/types/Project'

export type StatusFilterOption = {
  project_status: ProjectStatusKey
  project_status_cnt: number
}

type ProjectStatusFilterProps = {
  status: string,
  statusList: StatusFilterOption[]
  handleQueryChange: (key: string, value: string | string[]) => void
}

export const ProjectStatusLabels: {
  [K in ProjectStatusKey]: string
} = {
  'upcoming': 'Upcoming',
  'in_progress': 'In progress',
  'finished': 'Finished',
  'unknown': 'Unknown'
}

const title = 'Project status'

export default function ProjectStatusFilter({status, statusList, handleQueryChange}: ProjectStatusFilterProps) {

  // console.group('ProjectStatusFilter')
  // console.log('status...', status)
  // console.log('statusList...', statusList)
  // console.log('options...', options)
  // console.groupEnd()

  return (
    <FormControl
      data-testid="filters-project-status"
      fullWidth
      size="small"
    >
      <InputLabel id="project-status-label">{title}</InputLabel>
      <Select
        id="select-project-status"
        labelId="project-status-label"
        value={status}
        label={title}
        onChange={(e) => {
          if (e.target.value === 'all') {
            handleQueryChange('project_status', '')
          } else {
            handleQueryChange('project_status', e.target.value)
          }
        }}
      >
        {/* default None value */}
        <MenuItem value=""><em>Any</em></MenuItem>
        {
          statusList.map(option => <MenuItem key={option.project_status} value={option.project_status}>
            {ProjectStatusLabels[option.project_status] ?? option.project_status} ({option.project_status_cnt})
          </MenuItem>)
        }
      </Select>
    </FormControl>
  )
}
