// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'
import {useSession} from '~/auth'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchSoftwareTable} from './patchSoftwareTable'

export type AutosaveControlledSwitchProps = {
  software_id: string
  name: string,
  label: string,
  defaultValue: boolean
}

export default function AutosaveControlledSwitch({software_id,name,label,defaultValue}:AutosaveControlledSwitchProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control,resetField} = useFormContext()

  async function saveProjectInfo(value:boolean){
    const resp = await patchSoftwareTable({
      id: software_id,
      data: {
        [name]:value
      },
      token
    })

    // console.group('AutosaveControlledSwitch')
    // console.log('saved...', name)
    // console.log('value...', value)
    // console.log('status...', resp?.status)
    // console.groupEnd()

    if (resp?.status === 200) {
      // debugger
      resetField(name, {
        defaultValue:value
      })
    } else {
      showErrorMessage(`Failed to save ${name}. ${resp?.message}`)
    }
  }

  return (
    <ControlledSwitch
      name={name}
      label={label}
      defaultValue={defaultValue}
      control={control}
      onSave={saveProjectInfo}
    />
  )
}
