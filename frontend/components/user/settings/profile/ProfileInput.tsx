// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'
import LaunchIcon from '@mui/icons-material/Launch'

import modalConfig from '~/components/person/config'
import {useUserContext} from '~/components/user/context/UserContext'
import AutosaveProfileTextField from './AutosaveProfileTextField'
import AutosaveProfileSwitch from './AutosaveProfileSwitch'
import {findOrcidInLogin} from './apiLoginForAccount'

export default function ProfileInput() {
  const {orcidAuthLink, logins} = useUserContext()
  const orcid = findOrcidInLogin(logins)
  const publicProfile = {
    show: orcidAuthLink !== null,
    // disabled if ORCID account is not linked
    disabled: orcid===null,
    // orcid id linked
    orcid
  }
  // extract used methods
  const {watch,control} = useFormContext()
  // watch value changes
  const [
    given_names,family_names,email_address, role, affiliation, is_public
  ] = watch([
    'given_names','family_names','email_address','role','affiliation', 'is_public'
  ])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid lg:grid-cols-2 gap-8">
        <AutosaveProfileTextField
          options={{
            name: 'given_names',
            label: modalConfig.given_names.label,
            useNull: true,
            // defaultValue: profile.given_names,
            helperTextMessage: modalConfig.given_names.help,
            helperTextCnt: `${given_names?.length ?? 0}/${modalConfig.given_names.validation.maxLength.value}`,
          }}
          rules={modalConfig.given_names.validation}
        />
        <AutosaveProfileTextField
          options={{
            name: 'family_names',
            label: modalConfig.family_names.label,
            useNull: true,
            // defaultValue: profile.family_names,
            helperTextMessage: modalConfig.family_names.help,
            helperTextCnt: `${family_names?.length ?? 0}/${modalConfig.family_names.validation.maxLength.value}`,
          }}
          rules={modalConfig.family_names.validation}
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <AutosaveProfileTextField
          options={{
            name: 'role',
            label: modalConfig.role.label,
            useNull: true,
            // defaultValue: profile.role,
            helperTextMessage: 'Type in your current role',
            helperTextCnt: `${role?.length ?? 0}/${modalConfig.role.validation.maxLength.value}`,
          }}
          rules={modalConfig.role.validation}
        />
        <AutosaveProfileTextField
          options={{
            name: 'affiliation',
            label: modalConfig.affiliation.label,
            useNull: true,
            // defaultValue: profile.affiliation,
            helperTextMessage: 'Type in your current affiliation',
            helperTextCnt: `${affiliation?.length ?? 0}/${modalConfig.affiliation.validation.maxLength.value}`,
          }}
          rules={modalConfig.affiliation.validation}
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <AutosaveProfileTextField
          options={{
            name: 'email_address',
            label: modalConfig.email_address.label,
            useNull: true,
            // defaultValue: profile.email_address,
            helperTextMessage: 'Type in your contact email',
            helperTextCnt: `${email_address?.length ?? 0}/${modalConfig.email_address.validation(false).maxLength.value}`,
          }}
          rules={modalConfig.email_address.validation}
        />
        <div className="flex items-center justify-between gap-4">
          {
            publicProfile?.show ?
              <AutosaveProfileSwitch
                disabled={publicProfile.disabled}
                // defaultValue={is_public}
                name='is_public'
                control={control}
                label="Public Profile"
              />
              : null
          }
          {is_public === true && orcid ?
            <a href={`/profile/${orcid}/software`} className="flex gap-2 items-center" target='_blank'>
              Enabled <LaunchIcon sx={{width:'1rem'}}/>
            </a>
            :<span>Disabled (<a href="/documentation/users/user-settings/#public-profile" target='_blank'>how to enable? <LaunchIcon sx={{width:'1rem'}}/></a>)</span>
          }
        </div>
      </div>
    </div>
  )
}
