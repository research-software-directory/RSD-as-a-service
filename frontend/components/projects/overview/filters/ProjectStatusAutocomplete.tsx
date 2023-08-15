// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import FilterTitle from '~/components/filter/FilterTitle'
import FilterOption from '~/components/filter/FilterOption'

import useProjectOverviewParams from '../useProjectOverviewParams'
import {ProjectStatusKey} from '~/types/Project'

export type StatusFilterOption = {
  project_status: ProjectStatusKey
  project_status_cnt: number
}

type ProjectStatusFilterProps = {
  status: string,
  statusList: StatusFilterOption[]
}

export const ProjectStatusLabels: {
  [K in ProjectStatusKey]: string
} = {
  'pending': 'Pending',
  'in_progress': 'In progress',
  'finished': 'Finished',
  'unknown': 'Unknown'
}

const title = 'Project status'

export default function ProjectStatusFilter({status, statusList}: ProjectStatusFilterProps) {
  const {handleQueryChange} = useProjectOverviewParams()
  const [selected, setSelected] = useState<StatusFilterOption|null>(null)
  const [options, setOptions] = useState<StatusFilterOption[]>(statusList)

  // console.group('ProjectStatusFilter')
  // console.log('status...', status)
  // console.log('selected...', selected)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(() => {
    if (status && statusList &&
      statusList.length > 0) {
      const select = statusList.find(option => {
        return status === option.project_status
      })
      if (select) setSelected(select)
    } else if (status === '') {
      setSelected(null)
    }
    setOptions(statusList)
  },[status,statusList])

  return (
    <div>
      <FilterTitle
        title={title}
        count={statusList.length ?? ''}
      />
      <Autocomplete
        className="mt-4"
        value={selected}
        size="small"
        // multiple
        clearOnEscape
        options={options}
        getOptionLabel={(option) => (ProjectStatusLabels[option.project_status] ?? '')}
        isOptionEqualToValue={(option, value) => {
          return option.project_status === value.project_status
        }}
        // defaultValue={[]}
        filterSelectedOptions
        renderOption={(props, option) => (
          <FilterOption
            key={option.project_status}
            props={props}
            label={ProjectStatusLabels[option.project_status] ?? option.project_status}
            count={option.project_status_cnt}
          />
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder={title} />
        )}
        onChange={(event, newValue) => {
          // extract values into string[] for url query
          // const queryFilter = newValue.map(item => item.project_status)
          if (newValue) {
            handleQueryChange('project_status', newValue.project_status)
          } else {
            // clear filter
            handleQueryChange('project_status', '')
          }
        }}
      />
    </div>
  )
}
