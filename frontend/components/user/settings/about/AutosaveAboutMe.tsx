// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useController, useFormContext} from 'react-hook-form'

import MarkdownInputWithPreview from '~/components/form/MarkdownInputWithPreview'
import {Community} from '~/components/admin/communities/apiCommunities'
import usePatchUserProfile from '~/components/user/settings/profile/usePatchUserProfile'

type AutosaveControlledMarkdownProps = Readonly<{
  name: keyof Community
  maxLength: number
}>

export default function AutosaveAboutMe(props: AutosaveControlledMarkdownProps) {
  const saveProfileInfo = usePatchUserProfile()
  const {name,maxLength} = props
  const {register,control} = useFormContext()
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
    // patch user_profile table
    saveProfileInfo({name:'description',value:description})
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
      onBlur={saveMarkdown}
    />
  )
}
