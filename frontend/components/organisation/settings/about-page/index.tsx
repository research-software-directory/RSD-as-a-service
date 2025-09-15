// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {FormProvider, useForm} from 'react-hook-form'

import EditSectionTitle from '~/components/layout/EditSectionTitle'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import config from '~/components/organisation/settings/general/generalSettingsConfig'
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
  )
}
