// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {useUserContext} from '~/components/user/context/UserContext'
import config from './config'
import AutosaveAboutMe from './AutosaveAboutMe'

type AboutPageFormProps = {
  account: string
  description?: string | null
}


export default function UserAboutPage() {
  const {profile} = useUserContext()

  const methods = useForm<AboutPageFormProps>({
    mode: 'onChange',
    defaultValues: {
      account: profile.account,
      description: profile.description
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
          {...methods.register('account')}
        />
        <EditSectionTitle
          title={config.description.title}
          subtitle={config.description.subtitle}
        />
        <AutosaveAboutMe
          name="description"
          maxLength={config.description.validation.maxLength.value}
        />
      </form>
    </FormProvider>

  )
}
