// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import {useCommunityContext} from '~/components/communities/context'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {EditCommunityProps} from '~/components/communities/apiCommunities'
import config from './config'
import CommunityAdminSection from './CommunityAdminSection'
import AutosaveCommunityTextField from './AutosaveCommunityTextField'
import AutosaveCommunityKeywords from './AutosaveCommunityKeywords'

export default function CommunityGeneralSettings() {
  const {user} = useSession()
  const {community} = useCommunityContext()
  const methods = useForm<EditCommunityProps>({
    mode: 'onChange',
    defaultValues: community
  })
  // extract used methods
  const {watch, register} = methods
  const [name,short_description,website]=watch(['name','short_description','website'])

  // console.group('CommunityGeneralSettings')
  // console.log('short_description...', short_description)
  // console.log('community....', community)
  // console.log('website....', website)
  // console.log('isMaintainer....', isMaintainer)
  // console.groupEnd()

  return (
    <BaseSurfaceRounded
      className="mb-12 p-8"
      type="section"
    >
      <EditSectionTitle
        title="General settings"
      />
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          className="py-8"
        >
          {/* hidden inputs */}
          <input type="hidden"
            {...register('id')}
          />

          <AutosaveCommunityTextField
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
          <AutosaveCommunityTextField
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
          <AutosaveCommunityTextField
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

          <AutosaveCommunityKeywords />

          {/* RSD admin section */}
          {user?.role === 'rsd_admin' ?
            <CommunityAdminSection />
            : null
          }
        </form>
      </FormProvider>
    </BaseSurfaceRounded>
  )
}
