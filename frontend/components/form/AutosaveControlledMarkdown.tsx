// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useController, useFormContext} from 'react-hook-form'
import {useSession} from '~/auth/AuthProvider'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import useSnackbar from '~/components/snackbar/useSnackbar'

type PatchFnProps = {
  id: string,
  data: object,
  token: string
}

type AutosaveControlledMarkdownProps = {
  id: string
  name: string
  maxLength: number
  patchFn: (props:PatchFnProps)=>Promise<any>
}

export default function AutosaveControlledMarkdown(props: AutosaveControlledMarkdownProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {id,name, maxLength,patchFn} = props
  const {register, control, resetField} = useFormContext()
  const {field:{value},fieldState:{isDirty,error}} = useController({
    control,
    name
  })

  async function saveMarkdown() {
    // we do not save when error or no change
    if (isDirty === false || error) return
    // only if not empty string, we use null when empty
    const resp = await patchFn({
      id,
      data: {
        [name]:value
      },
      token
    })

    // console.group('AutosaveControlledMarkdown')
    // console.log('saved...', name)
    // console.log('status...', resp?.status)
    // console.groupEnd()

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${name}. ${resp?.message}`)
    } else {
      // debugger
      resetField(name, {
        defaultValue:value
      })
    }
  }

  // console.group('AutosaveControlledMarkdown')
  // console.log('name...', name)
  // console.log('value...', value)
  // console.log('isDirty...', isDirty)
  // console.log('error...', error)
  // console.groupEnd()

  return (
    <MarkdownInputWithPreview
      markdown={value ?? ''}
      register={register(name, {
        maxLength
      })}
      disabled={false}
      helperInfo={{
        length: value?.length ?? 0,
        maxLength
      }}
      onBlur={()=>saveMarkdown()}
    />
  )
}
