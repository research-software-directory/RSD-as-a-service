// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'

import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import config from '../general/generalSettingsConfig'
import useOrganisationContext from '../../context/useOrganisationContext'
import AutosaveOrganisationDescription from './AutosaveOrganisationDescription'

type AboutPageFormProps = {
  id?: string
  description?: string | null
}

export default function AboutPageSettings() {
  const {id, description} = useOrganisationContext()

  const methods = useForm<AboutPageFormProps>({
    mode: 'onChange',
    defaultValues: {
      id,
      description
    }
  })

  return (
    <BaseSurfaceRounded
      className="flex-1 flex flex-col mb-12 p-4"
      type="section"
    >
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          className="flex-1 flex flex-col py-4"
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
