// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/navigation'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchOrganisationTable} from '../updateOrganisationSettings'
import {OrganisationForOverview} from '~/types/Organisation'
import useOrganisationContext from '../../context/useOrganisationContext'


export type AutosaveOrganisationTextFieldProps = {
  options: ControlledTextFieldOptions<OrganisationForOverview>
  rules?: any
}

export default function AutosaveOrganisationTextField({options,rules}:AutosaveOrganisationTextFieldProps) {
  const router = useRouter()
  const {token} = useSession()
  const {id,updateOrganisationContext} = useOrganisationContext()
  const {showErrorMessage} = useSnackbar()
  const {control, resetField} = useFormContext()

  async function saveOrganisationInfo({name, value}: OnSaveProps<OrganisationForOverview>) {
    // patch project table
    const resp = await patchOrganisationTable({
      id: id ?? '',
      data: {
        [name]:value
      },
      token
    })

    // console.group('AutosaveOrganisationTextField')
    // console.log('saved...', options.name)
    // console.log('value...', value)
    // console.log('status...', resp?.status)
    // console.groupEnd()

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${options.name}. ${resp?.message}`)
    } else {
      // debugger
      updateOrganisationContext({
        key: options.name,
        value
      })
      // debugger
      resetField(options.name, {
        defaultValue:value
      })
      if (name === 'parent' || name === 'slug') {
        const url = `/api/v1/rpc/organisation_route?id=${id}`
        const slugResp = await fetch(url)
        if (slugResp?.status !== 200) {
          showErrorMessage('Failed to fetch new organisation slug.')
        } else {
          const json = await slugResp.json()
          const updatedSlug = json[0].rsd_path
          const newUrl = `/organisations/${updatedSlug}?tab=settings&settings=general`
          router.push(newUrl, {scroll: false})
        }
      }
    }
  }

  return (
    <AutosaveControlledTextField
      options={options}
      control={control}
      rules={rules}
      onSaveField={saveOrganisationInfo}
    />
  )
}
