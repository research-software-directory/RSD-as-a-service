// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect} from 'react'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {EditProject} from '~/types/Project'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {projectInformation as config} from './config'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {patchProjectTable} from './patchProjectInfo'

export default function AutosaveProjectPeriod({date_start, date_end}:
{date_start: string | null, date_end: string | null}) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control, watch, setError, clearErrors, resetField} = useFormContext<EditProject>()
  const [id, start, end] = watch(['id', 'date_start', 'date_end'])

  const validateDateRange = useCallback(() => {
    if (start && end) {
      const start_date = new Date(start)
      const end_date = new Date(end)
      // console.group('validateDateRange')
      // console.log('start_date...', start_date)
      // console.log('end_date...', end_date)
      // console.log('start...', start)
      // console.log('end...', end)
      // console.groupEnd()

      if (start_date > end_date) {
        // we need to wait for event loop to complete before setting new error
        setTimeout(() => {
          setError('date_start', {type: 'validate', message: 'Start date > End date'})
          setError('date_end', {type:'validate',message:'End date < Start date'})
        }, 1)
      } else {
        // console.log('clearErrors')
        clearErrors(['date_start','date_end'])
      }
    }
  }, [start, end, clearErrors, setError])

  // date validation
  useEffect(() => {
    if (start && end) {
      validateDateRange()
    }
  }, [start, end, validateDateRange])

  async function saveProjectPeriod({name}: OnSaveProps<EditProject>) {
    // console.group('saveProjectPeriod')
    // console.log('name...', name)
    // console.log('start...', start)
    // console.log('end...', end)
    // console.groupEnd()

    // patch project table, both values at the same time
    const resp = await patchProjectTable({
      id,
      data: {
        'date_start': start,
        'date_end': end
      },
      token
    })

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${name}. ${resp?.message}`)
    } else {
      // rest changed field after save to remove dirty/touched flags
      resetField('date_start', {
        defaultValue: start
      })
      resetField('date_end', {
        defaultValue: end
      })
    }
  }

  return (
    <div className="flex">
      <AutosaveControlledTextField
        control={control}
        onSaveField={saveProjectPeriod}
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
            slotProps:{
              inputLabel:{
                shrink: true
              }
            },
          }
        }}
      />
      <div className="px-5"></div>
      <AutosaveControlledTextField
        control={control}
        onSaveField={saveProjectPeriod}
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
            slotProps:{
              inputLabel:{
                shrink: true
              }
            },
          }
        }}
      />
    </div>
  )
}
