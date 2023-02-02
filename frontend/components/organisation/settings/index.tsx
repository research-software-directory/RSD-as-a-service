// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'

import {useSession} from '../../../auth'
import {OrganisationForOverview} from '../../../types/Organisation'
import {organisationInformation as config} from '../organisationConfig'
import RorIdWithUpdate from './RorIdWithUpdate'
import RsdAdminSection from './RsdAdminSection'
import ProtectedOrganisationPage from '../ProtectedOrganisationPage'
import AutosaveOrganisationTextField from './AutosaveOrganisationTextField'
import UserAgrementModal from '~/components/user/settings/UserAgreementModal'

const formId='organisation-settings-form'

export default function OrganisationSettings({organisation, isMaintainer}:
  { organisation: OrganisationForOverview, isMaintainer: boolean }) {
  const {user} = useSession()
  const methods = useForm<OrganisationForOverview>({
    mode: 'onChange',
    defaultValues: organisation
  })
  // extract used methods
  const {
    watch, register, formState
  } = methods
  // const {isValid, isDirty} = formState
  const [name,website]=watch(['name','website'])

  // console.group('OrganisationSettings')
  // console.log('isDirty...', isDirty)
  // console.log('isValid...', isValid)
  // console.groupEnd()

  return (
    <ProtectedOrganisationPage
      isMaintainer={isMaintainer}
    >
    <UserAgrementModal />
    <FormProvider {...methods}>
    <form
      id={formId}
      // onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="py-4"
    >
      {/* hidden inputs */}
      <input type="hidden"
        {...register('id')}
      />
      <input type="hidden"
        {...register('parent')}
      />
      <section className="flex justify-between align-center">
        <h2>Settings</h2>
      </section>
      <div className="flex pt-8"></div>
        <section className="grid grid-cols-[1fr,1fr] gap-8">
          <AutosaveOrganisationTextField
            organisation_id={organisation.id}
            options={{
              name: 'name',
              label: config.name.label,
              useNull: true,
              defaultValue: name,
              helperTextMessage: config.name.help,
              helperTextCnt: `${name?.length || 0}/${config.name.validation.maxLength.value}`,
            }}
            rules={config.name.validation}
          />
          <RorIdWithUpdate />
        </section>
        <div className="py-4"></div>
        <AutosaveOrganisationTextField
          organisation_id={organisation.id}
          options={{
            name: 'website',
            label: config.website.label,
            useNull: true,
            defaultValue: website,
            helperTextMessage: config.website.help,
            helperTextCnt: `${website?.length || 0}/${config.website.validation.maxLength.value}`,
          }}
          rules={config.website.validation}
        />
      <div className="py-4"></div>
      {/* RSD admin section */}
      {user?.role === 'rsd_admin' ?
        <RsdAdminSection />
        : null
      }
    </form>
    </FormProvider>
    </ProtectedOrganisationPage>
  )
}
