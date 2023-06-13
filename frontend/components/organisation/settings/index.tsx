// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
import AutosaveControlledMarkdown from '~/components/form/AutosaveControlledMarkdown'
import {patchOrganisationTable} from './updateOrganisationSettings'
import EditSectionTitle from '~/components/layout/EditSectionTitle'

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
  const [id,name,website,short_description]=watch(['id','name','website','short_description'])

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

      <h2 className="pb-8">Settings</h2>

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
      <AutosaveOrganisationTextField
        organisation_id={organisation.id}
        options={{
          name: 'short_description',
          label: config.short_description.label,
          useNull: true,
          defaultValue: short_description,
          helperTextMessage: config.short_description.help,
          helperTextCnt: `${short_description?.length || 0}/${config.short_description.validation.maxLength.value}`,
        }}
        rules={config.short_description.validation}
      />
      <div className="py-4"></div>
      {/* RSD admin section */}
      {user?.role === 'rsd_admin' ?
        <RsdAdminSection />
        : null
      }
      {/* About page section */}
      <EditSectionTitle
        title={config.description.title}
        subtitle={config.description.subtitle}
      />
      <AutosaveControlledMarkdown
        id={id}
        name="description"
        maxLength={config.description.validation.maxLength.value}
        patchFn={patchOrganisationTable}
      />
    </form>
    </FormProvider>
    </ProtectedOrganisationPage>
  )
}
