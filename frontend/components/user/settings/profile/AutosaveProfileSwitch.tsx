// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ControlledSwitch, {ControlledSwitchProps} from '~/components/form/ControlledSwitch'
import usePatchUserProfile from './usePatchUserProfile'
import {UserProfile} from './apiUserProfile'

type AutosaveProfileSwitchProps = Readonly<Omit<ControlledSwitchProps<UserProfile>,'onSave'>>

export default function AutosaveProfileSwitch(props:AutosaveProfileSwitchProps) {
  const saveProfileInfo = usePatchUserProfile()

  return (
    <ControlledSwitch
      {...props}
      onSave={(value)=>{
        saveProfileInfo({name:props.name,value})
      }}
    />
  )
}
