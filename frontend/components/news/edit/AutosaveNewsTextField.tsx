// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/navigation'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import AutosaveControlledTextField, {OnSaveProps} from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {NewsItem, patchNewsTable} from '../apiNews'

export type AutosaveNewsTextFieldProps = {
  news_id: string
  options: ControlledTextFieldOptions<NewsItem>
  rules?: any
}

export default function AutosaveNewsTextField({news_id,options,rules}:AutosaveNewsTextFieldProps) {
  const router = useRouter()
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control, resetField} = useFormContext()

  async function saveNewsInfo({name, value}: OnSaveProps<NewsItem>) {
    // patch project table
    const resp = await patchNewsTable({
      id: news_id,
      data: {
        [name]:value
      },
      token
    })

    // console.group('AutosaveNewsTextField')
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
      // replace old page
      router.replace(`/news/${value}/edit`)
    }
  }

  return (
    <AutosaveControlledTextField
      options={options}
      control={control}
      rules={rules}
      onSaveField={saveNewsInfo}
    />
  )
}
