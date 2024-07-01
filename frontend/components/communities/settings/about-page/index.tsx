// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'

import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import config from './config'
import AutosaveOrganisationDescription from './AutosaveCommunityDescription'

import {useCommunityContext} from '~/components/communities/context'

type AboutPageFormProps = {
  id?: string
  description?: string | null
}


export default function CommunityAboutPage() {
  const {community} = useCommunityContext()

  const methods = useForm<AboutPageFormProps>({
    mode: 'onChange',
    defaultValues: {
      id: community?.id,
      description: community?.description
    }
  })

  return (
    <BaseSurfaceRounded
      className="flex-1 flex flex-col mb-12 p-8"
      type="section"
    >
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          className="flex-1 flex flex-col"
        >
          {/* hidden inputs */}
          <input type="hidden"
            {...methods.register('id')}
          />
          <EditSectionTitle
            title={config.description.title}
            subtitle={config.description.subtitle}
          />
          <AutosaveOrganisationDescription
            name="description"
            maxLength={config.description.validation.maxLength.value}
          />
        </form>
      </FormProvider>
    </BaseSurfaceRounded>
  )
}
