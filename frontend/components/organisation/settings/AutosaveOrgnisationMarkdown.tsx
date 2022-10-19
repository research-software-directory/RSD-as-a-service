// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useController, useFormContext} from 'react-hook-form'
import {useSession} from '~/auth'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {organisationInformation as config} from '../organisationConfig'
import {patchOrganisationTable} from './updateOrganisationSettings'

export default function AutosaveOrganisationMarkdown({organisation_id}: {organisation_id:string}) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {register, control, resetField} = useFormContext()
  const {field:{value},fieldState:{isDirty,error}} = useController({
    control,
    name:'description'
  })

  async function saveOrganisationInfo() {
    let description = null
    // we do not save when error or no change
    if (isDirty===false || error) return
    // only if not empty string, we use null when empty
    if (value!=='') description = value
    const resp = await patchOrganisationTable({
      id:organisation_id,
      data: {
        description
      },
      token
    })
    // console.group('AutosaveOrganisationMarkdown')
    // console.log('isDirty...', isDirty)
    // console.log('error...', error)
    // console.log('status...', resp?.status)
    // console.groupEnd()
    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save description. ${resp?.message}`)
    } else {
      // debugger
      resetField('description', {
        defaultValue:value
      })
    }
  }
  // console.group('AutosaveOrganisationMarkdown')
  // console.log('value...', value)
  // console.groupEnd()
  return (
    <MarkdownInputWithPreview
      markdown={value ?? ''}
      register={register('description', {
        maxLength: config.description.validation.maxLength.value
      })}
      disabled={false}
      helperInfo={{
        length: value?.length ?? 0,
        maxLength: config.description.validation.maxLength.value
      }}
      onBlur={()=>saveOrganisationInfo()}
    />
  )
}
