// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchProjectTable} from './patchProjectInfo'

export type AutosaveProjectSwitchProps = {
  project_id: string
  name: string,
  label: string,
  defaultValue: boolean
}

export default function AutosaveProjectSwitch({project_id,name,label,defaultValue}:AutosaveProjectSwitchProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control,resetField} = useFormContext()

  async function saveProjectInfo(value:boolean){
    const resp = await patchProjectTable({
      id: project_id,
      data: {
        [name]:value
      },
      token
    })

    // console.group('AutosaveProjectSwitch')
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
      showErrorMessage(`Failed to save ${label.toLowerCase()}. ${resp?.message}`)
      // On error we reset value to defaultValue/original value
      // to let user know that update failed
      setTimeout(() => {
        resetField(name, {
          defaultValue
        })
      },100)
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
