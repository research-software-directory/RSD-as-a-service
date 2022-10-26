// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useController, useFormContext} from 'react-hook-form'
import {useSession} from '~/auth'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {projectInformation as config} from './config'
import {patchProjectTable} from './patchProjectInfo'

export default function AutosaveProjectMarkdown({project_id,name}: {project_id:string,name:string}) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {register, control, resetField} = useFormContext()
  const {field:{value},fieldState:{isDirty,error}} = useController({
    control,
    name
  })

  async function saveProjectInfo() {
    let description = null
    // we do not save when error or no change
    if (isDirty === false || error) return
    // only if not empty string, we use null when empty
    if (value!=='') description = value
    const resp = await patchProjectTable({
      id:project_id,
      data: {
        [name]:value
      },
      token
    })

    // console.group('AutosaveProjectMarkdown')
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

  // console.group('AutosaveProjectMarkdown')
  // console.log('name...', name)
  // console.log('value...', value)
  // console.log('isDirty...', isDirty)
  // console.log('error...', error)
  // console.groupEnd()

  return (
    <MarkdownInputWithPreview
      markdown={value ?? ''}
      register={register(name, {
        maxLength: config.description.validation.maxLength.value
      })}
      disabled={false}
      helperInfo={{
        length: value?.length ?? 0,
        maxLength: config.description.validation.maxLength.value
      }}
      onBlur={()=>saveProjectInfo()}
    />
  )
}
