// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent} from 'react'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

import {Controller, useFormContext} from 'react-hook-form'

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {EditSoftwareItem} from '~/types/SoftwareTypes'
import {patchSoftwareTable} from './patchSoftwareTable'

export default function AutosaveLicenseType() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control,watch,resetField} = useFormContext<EditSoftwareItem>()
  const [id,open_source] = watch(['id','open_source'])

  // console.group('AutosaveLicenseType')
  // console.log('id...', id)
  // console.log('open_source...', open_source)
  // console.groupEnd()

  async function updateOpenSource(e:ChangeEvent<HTMLInputElement>,value: string){
    // patch project table
    const resp = await patchSoftwareTable({
      id,
      data: {
        'open_source': value==='open_source'
      },
      token
    })

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save license type. ${resp?.message}`)
    } else {
      // debugger
      resetField('open_source', {
        defaultValue: value==='open_source'
      })
    }
  }

  return (
    <Controller
      name="open_source"
      defaultValue={open_source}
      control={control}
      render={({field}) => {
        const {value} = field
        return (
          <FormControl>
            {/* <FormLabel id="license-type-radio-group">{config.open_source.label}</FormLabel> */}
            <RadioGroup
              row
              aria-labelledby="license-type-radio-group"
              value={value ? 'open_source' : 'proprietary'}
              onChange={updateOpenSource}
            >
              <FormControlLabel
                value="open_source"
                control={<Radio />}
                label="Open source"
              />
              <FormControlLabel
                value="proprietary"
                control={<Radio />}
                label="Proprietary"
              />
            </RadioGroup>
            {/* <FormHelperText>{config.open_source.help}</FormHelperText> */}
          </FormControl>
        )
      }}
    />
  )
}
