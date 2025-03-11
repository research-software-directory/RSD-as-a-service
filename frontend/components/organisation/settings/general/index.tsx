// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'

import {useSession} from '~/auth'
import {OrganisationForOverview} from '~/types/Organisation'
import useOrganisationContext from '../../context/useOrganisationContext'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import config from './generalSettingsConfig'
import AutosaveOrganisationTextField from './AutosaveOrganisationTextField'
import RorIdWithUpdate from './RorIdWithUpdate'
import RsdAdminSection from './RsdAdminSection'

export default function OrganisationGeneralSettings() {
  const {user} = useSession()
  // extract organisation values from hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {isMaintainer,...organisation} = useOrganisationContext()
  const methods = useForm<OrganisationForOverview>({
    mode: 'onChange',
    defaultValues: organisation
  })
  // extract used methods
  const {
    watch, register
  } = methods

  const [name,website,short_description]=watch(['name','website','short_description'])

  // console.group('OrganisationGeneralSettings')
  // console.log('short_description...', short_description)
  // console.log('website....', website)
  // console.groupEnd()

  return (
    <BaseSurfaceRounded
      className="mb-12 p-4"
      type="section"
    >
      <FormProvider {...methods}>
        <form
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

          <h2 className="pb-8">General settings</h2>

          <AutosaveOrganisationTextField
            options={{
              name: 'name',
              label: config.name.label,
              useNull: true,
              defaultValue: name,
              helperTextMessage: config.name.help,
              helperTextCnt: `${name?.length ?? 0}/${config.name.validation.maxLength.value}`,
            }}
            rules={config.name.validation}
          />

          <div className="py-4"></div>
          <AutosaveOrganisationTextField
            options={{
              name: 'short_description',
              label: config.short_description.label,
              useNull: true,
              defaultValue: short_description,
              helperTextMessage: config.short_description.help,
              helperTextCnt: `${short_description?.length ?? 0}/${config.short_description.validation.maxLength.value}`,
            }}
            rules={config.short_description.validation}
          />
          <div className="py-4"></div>
          <section className="grid grid-cols-[1fr_1fr] gap-8">
            <AutosaveOrganisationTextField
              options={{
                name: 'website',
                label: config.website.label,
                useNull: true,
                defaultValue: website,
                helperTextMessage: config.website.help,
                helperTextCnt: `${website?.length ?? 0}/${config.website.validation.maxLength.value}`,
              }}
              rules={config.website.validation}
            />
            <RorIdWithUpdate />
          </section>
          <div className="py-4"></div>
          {/* RSD admin section */}
          {user?.role === 'rsd_admin' ?
            <RsdAdminSection />
            : null
          }
        </form>
      </FormProvider>
    </BaseSurfaceRounded>
  )
}
