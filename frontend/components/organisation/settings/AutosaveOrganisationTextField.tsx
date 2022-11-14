// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'
import {useSession} from '~/auth'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchOrganisationTable} from './updateOrganisationSettings'

export type AutosaveProjectInfoProps = {
  organisation_id: string
  options: ControlledTextFieldOptions
  rules?: any
}

export default function AutosaveOrganisationTextField({organisation_id,options,rules}:AutosaveProjectInfoProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control, resetField} = useFormContext()

  async function saveSoftwareInfo({name, value}: OnSaveProps) {
    // patch project table
    const resp = await patchOrganisationTable({
      id: organisation_id,
      data: {
        [name]:value
      },
      token
    })

    // console.group('AutosaveSoftwareTextField')
    // console.log('saved...', options.name)
    // console.log('value...', value)
    // console.log('status...', resp?.status)
    // console.groupEnd()

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${options.name}. ${resp?.message}`)
    } else {
      // debugger
      resetField(options.name, {
        defaultValue:value
      })
    }
  }

  return (
    <AutosaveControlledTextField
      options={options}
      control={control}
      rules={rules}
      onSaveField={saveSoftwareInfo}
    />
  )
}
