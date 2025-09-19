// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'
import {useRouter} from 'next/navigation'

import {useSession} from '~/auth/AuthProvider'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {Community} from '~/components/admin/communities/apiCommunities'
import {patchCommunityTable} from '~/components/communities/apiCommunities'
import {useCommunityContext} from '~/components/communities/context'

export type AutosaveCommunityTextFieldProps = {
  options: ControlledTextFieldOptions<Community>
  rules?: any
}

export default function AutosaveCommunityTextField({options,rules}:AutosaveCommunityTextFieldProps) {
  const router = useRouter()
  const {token} = useSession()
  const {community,updateCommunity} = useCommunityContext()
  const {showErrorMessage} = useSnackbar()
  const {control, resetField} = useFormContext()

  async function saveCommunityInfo({name, value}: OnSaveProps<Community>) {
    // console.group('AutosaveCommunityTextField')
    // console.log('name...', name)
    // console.log('value...', value)
    // console.groupEnd()
    // patch community table
    const resp = await patchCommunityTable({
      id: community?.id ?? '',
      data: {
        [name]:value
      },
      token
    })

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${name}. ${resp?.message}`)
    } else {
      // debugger
      updateCommunity({
        key: options.name,
        value
      })
      // debugger
      resetField(options.name, {
        defaultValue:value
      })
      if (name === 'slug') {
        const url = `/communities/${value}/settings?tab=general`
        router.push(url, {scroll: false})
      }
    }
  }

  return (
    <AutosaveControlledTextField
      options={options}
      control={control}
      rules={rules}
      onSaveField={saveCommunityInfo}
    />
  )
}
