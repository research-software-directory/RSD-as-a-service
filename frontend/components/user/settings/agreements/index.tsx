// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {FormProvider, useForm} from 'react-hook-form'

import ControlledSwitch from '~/components/form/ControlledSwitch'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useRsdSettings from '~/config/useRsdSettings'
import {UserSettingsType, useUserAgreements} from './useUserAgreements'
import RemoveAccount from './RemoveAccount'

export default function UserAgreementsPage() {
  const {host} = useRsdSettings()
  const {
    agree_terms,notice_privacy_statement,
    setAgreeTerms,setPrivacyStatement,
    loading
  } = useUserAgreements()
  const methods = useForm<UserSettingsType>({
    mode: 'onChange',
    defaultValues:{
      agree_terms,
      notice_privacy_statement,
    }
  })

  if (loading) {
    return <ContentLoader />
  }

  return (
    <>
      <EditSectionTitle
        title="User agreements"
        className="font-medium"
      />
      <p className="mt-4">
        To be able to contribute to the RSD, we need to know that you agree to our Terms of Service, and that you have read the Privacy Statement.
      </p>
      <p>
        Please check all of the points below to proceed:
      </p>
      <FormProvider {...methods}>
        <form
          id="user-agreements-form"
          className='flex-1 flex flex-col gap-2 my-8'
        >
          <ControlledSwitch
            defaultValue={agree_terms}
            name='agree_terms'
            control={methods.control}
            onSave={setAgreeTerms}
            label={
              <span>I agree to the <Link className="underline" target='_blank' href={host?.terms_of_service_url ?? ''}>Terms of Service</Link>.</span>
            }
          />

          <ControlledSwitch
            defaultValue={notice_privacy_statement}
            name='notice_privacy_statement'
            control={methods.control}
            onSave={setPrivacyStatement}
            label={
              <span>I have read the <Link className='underline' target='_blank' href={host?.privacy_statement_url ?? ''}>Privacy Statement</Link>.</span>
            }
          />
          {/* use FormProvider to check for user agreement values */}
          <RemoveAccount />
        </form>
      </FormProvider>
    </>
  )
}
