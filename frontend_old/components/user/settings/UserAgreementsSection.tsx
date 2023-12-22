// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {useFormContext} from 'react-hook-form'
import useRsdSettings from '~/config/useRsdSettings'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import {UserSettingsType} from './useUserAgreements'

type UserAgreementsProps = {
  agree_terms?:boolean,
  notice_privacy_statement?:boolean,
  public_orcid_profile?:boolean,
  setAgreeTerms:(agree:boolean)=>Promise<void>,
  setPrivacyStatement:(privacy:boolean)=>Promise<void>,
  setPublicOrcidProfile:(profile:boolean)=>Promise<void>,
  publicProfile?: {
    show: boolean
    disabled: boolean
  }
}

const defaultPublicProfileProps = {
  show: false,
  disabled: false
}

export default function UserAgreementsSection({
  agree_terms,
  notice_privacy_statement,
  public_orcid_profile,
  setAgreeTerms,
  setPrivacyStatement,
  setPublicOrcidProfile,
  publicProfile=defaultPublicProfileProps
}:UserAgreementsProps) {

  const {host} = useRsdSettings()
  const {control} = useFormContext<UserSettingsType>()

  return(
    <div className="py-4">
      <h2>User agreements</h2>
      <div className="py-4">
          To be able to contribute to the RSD, we need to know that you agree to our Terms of Service, and that you have read the Privacy Statement. Please check all of the points below to proceed:
      </div>
      <div>
        <ControlledSwitch
          defaultValue={agree_terms}
          name='agree_terms'
          control={control}
          onSave={setAgreeTerms}
          label={
            <span>I agree to the <Link className="underline" target='_blank' href={host?.terms_of_service_url ?? ''}>Terms of Service</Link>.</span>
          }
        />
      </div>
      <div>
        <ControlledSwitch
          defaultValue={notice_privacy_statement}
          name='notice_privacy_statement'
          control={control}
          onSave={setPrivacyStatement}
          label={
            <span>I have read the <Link className='underline' target='_blank' href={host?.privacy_statement_url ?? ''}>Privacy Statement</Link>.</span>
          }
        />
      </div>
      {
        publicProfile.show ?
          <div>
            <ControlledSwitch
              disabled={publicProfile.disabled && public_orcid_profile===false}
              defaultValue={public_orcid_profile}
              name='public_orcid_profile'
              control={control}
              onSave={setPublicOrcidProfile}
              label={
                <span>Enable my <Link className="underline" target='_blank' href="/documentation/users/user-settings/#public-profile">Public Profile</Link></span>
              }
            />
          </div>
          : null
      }
    </div>
  )
}
