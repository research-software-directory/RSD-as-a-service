// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useRouter} from 'next/navigation'
import {useFormContext} from 'react-hook-form'
import {useSession} from '~/auth/AuthProvider'
import {EditSoftwareItem} from '~/types/SoftwareTypes'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useSoftwareContext from '../context/useSoftwareContext'
import {patchSoftwareTable} from './patchSoftwareTable'

export type AutosaveSoftwareInfoProps = {
  software_id: string
  options: ControlledTextFieldOptions<EditSoftwareItem>
  rules?: any
}

export default function AutosaveSoftwareTextField({software_id,options,rules}:AutosaveSoftwareInfoProps) {
  const router = useRouter()
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {setSoftwareTitle, setSoftwareSlug, setConceptDoi} = useSoftwareContext()
  const {control, resetField} = useFormContext()

  async function saveSoftwareInfo({name, value}: OnSaveProps<EditSoftwareItem>) {
    // patch project table
    const resp = await patchSoftwareTable({
      id: software_id,
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
      // update shared state
      updateSharedInfo(value)
    }
  }

  function updateSharedInfo(value:string) {
    if (options.name === 'slug') {
      // update software slug
      setSoftwareSlug(value)
      // reload page
      router.push(`/software/${value}/edit/information`)
    }
    if (options.name === 'brand_name') {
      setSoftwareTitle(value)
    }
    if (options.name === 'concept_doi') {
      setConceptDoi(value)
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
