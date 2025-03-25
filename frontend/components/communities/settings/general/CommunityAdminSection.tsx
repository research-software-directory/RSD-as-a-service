// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'

import config from './config'
import AutosaveOrganisationTextField from './AutosaveCommunityTextField'

export default function CommunityAdminSection() {
  const {watch} = useFormContext()
  const [
    slug, primary_maintainer
  ] = watch([
    'slug', 'primary_maintainer'
  ])

  return (
    <>
      <h3 className='pb-4'>Admin section</h3>
      <section className="grid grid-cols-[1fr_1fr] gap-8 py-4">
        <AutosaveOrganisationTextField
          options={{
            name: 'slug',
            label: config.slug.label,
            useNull: true,
            defaultValue: slug,
            helperTextMessage: config.slug.help,
            helperTextCnt: `${slug?.length || 0}/${config.slug.validation.maxLength.value}`
          }}
          rules={config.slug.validation}
        />
        <AutosaveOrganisationTextField
          options={{
            name: 'primary_maintainer',
            label: config.primary_maintainer.label,
            useNull: true,
            defaultValue: primary_maintainer,
            helperTextMessage: config.primary_maintainer.help,
            helperTextCnt: `${primary_maintainer?.length || 0}/${config.primary_maintainer.validation.maxLength.value}`,
          }}
          rules={config.primary_maintainer.validation}
        />
      </section>
    </>
  )
}
