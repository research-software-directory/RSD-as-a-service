// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'

import AutosaveControlledTextField from '~/components/form/AutosaveControlledTextField'
import {ControlledTextFieldOptions} from '~/components/form/ControlledTextField'
import {UserProfile} from './apiUserProfile'
import usePatchUserProfile from './usePatchUserProfile'

export type AutosaveCommunityTextFieldProps = Readonly<{
  options: ControlledTextFieldOptions<UserProfile>
  rules?: any
}>

export default function AutosaveProfileTextField({options,rules}:AutosaveCommunityTextFieldProps) {
  const {control} = useFormContext()
  const saveProfileInfo = usePatchUserProfile()

  return (
    <AutosaveControlledTextField
      options={options}
      control={control}
      rules={rules}
      onSaveField={saveProfileInfo}
    />
  )
}
