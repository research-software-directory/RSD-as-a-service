// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {useFormContext} from 'react-hook-form'

import {EditProject} from '~/types/Project'
import AutosaveProjectTextField from './AutosaveProjectTextField'
import {projectInformation as config} from './config'

export default function AutosaveProjectPeriod({date_start, date_end}:
  { date_start: string | null, date_end: string | null }) {
  const {setError, watch} = useFormContext<EditProject>()
  const [id, start, end] = watch(['id', 'date_start', 'date_end'])

  // end_date validation
  // useEffect(() => {
  //   if (start && end) {
  //     const start_date = new Date(start)
  //     const end_date = new Date(end)
  //     if (start_date >= end_date) {
  //       debugger
  //       setError('date_end', {type:'required',message:'Less then start date'})
  //     }
  //   }
  // },[start,end,setError])

  return (
    <div className="flex">
      <AutosaveProjectTextField
        project_id={id}
        options={{
          name: 'date_start',
          label: '',
          defaultValue: date_start,
          useNull: true,
          muiProps:{
            autoComplete: 'off',
            variant: 'standard',
            label: config.date_start.label,
            type: 'date',
            InputLabelProps:{
              shrink: true
            }
          }
        }}
      />
      <div className="px-5"></div>
      <AutosaveProjectTextField
        project_id={id}
        options={{
          name: 'date_end',
          label: '',
          defaultValue: date_end,
          useNull: true,
          muiProps:{
            autoComplete: 'off',
            variant: 'standard',
            label: config.date_end.label,
            type: 'date',
            InputLabelProps:{
              shrink: true
            }
          }
        }}
      />
    </div>
  )
}
