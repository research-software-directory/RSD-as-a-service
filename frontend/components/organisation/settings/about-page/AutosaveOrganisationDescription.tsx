// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useController, useFormContext} from 'react-hook-form'
import {useSession} from '~/auth/AuthProvider'
import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchOrganisationTable} from '../updateOrganisationSettings'
import useOrganisationContext from '../../context/useOrganisationContext'
import {OrganisationForOverview} from '~/types/Organisation'

type AutosaveControlledMarkdownProps = {
  name: keyof OrganisationForOverview
  maxLength: number
}

export default function AutosaveOrganisationDescription(props: AutosaveControlledMarkdownProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {name,maxLength} = props
  const {register,control,resetField} = useFormContext()
  const {id,updateOrganisationContext} = useOrganisationContext()
  const {field:{value},fieldState:{isDirty,error}} = useController({
    control,
    name
  })

  async function saveMarkdown() {
    let description = null
    // we do not save when error or no change
    if (isDirty === false || error) return
    // only if not empty string, we use null when empty
    if (value !== '') description = value
    // patch project table
    const resp = await patchOrganisationTable({
      id: id ?? '',
      data: {
        [name]: description
      },
      token
    })

    // console.group('AutosaveOrganisationDescription')
    // console.log('saved...', name)
    // console.log('status...', resp?.status)
    // console.groupEnd()

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${name}. ${resp?.message}`)
    } else {
      // debugger
      updateOrganisationContext({
        key: name,
        value
      })
      // debugger
      resetField(name, {
        defaultValue:value
      })
    }
  }

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
