// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ControlledTextField from '~/components/form/ControlledTextField'
import ControlledSwitch from '~/components/form/ControlledSwitch'
import {Control, useWatch} from 'react-hook-form'
import {EditOrganisation, OrganisationForOverview} from '~/types/Organisation'
import {organisationInformation as config} from '../organisationConfig'

type AdminSectionProps = {
  control: Control<OrganisationForOverview,any>
}

export default function AdminSection({control}:AdminSectionProps) {
  const slug = useWatch({
    control,
    name:'slug'
  })
  const primary_maintainer = useWatch({
    control,
    name:'primary_maintainer'
  })
  const is_tenant = useWatch({
    control,
    name:'is_tenant'
  })

  return (
    <>
    <section className="grid grid-cols-[1fr,1fr] gap-8 pt-8">
      <ControlledTextField
        control={control}
        options={{
          name: 'slug',
          // variant: 'outlined',
          label: config.slug.label,
          useNull: true,
          defaultValue: slug,
          helperTextMessage: config.slug.help,
          helperTextCnt: `${slug?.length || 0}/${config.slug.validation.maxLength.value}`
        }}
        rules={config.slug.validation}
      />
      <ControlledTextField
        control={control}
        options={{
          name: 'primary_maintainer',
          // variant: 'outlined',
          label: config.primary_maintainer.label,
          useNull: true,
          defaultValue: primary_maintainer,
          helperTextMessage: config.primary_maintainer.help,
          helperTextCnt: `${primary_maintainer?.length || 0}/${config.primary_maintainer.validation.maxLength.value}`,
        }}
        rules={config.primary_maintainer.validation}
      />
    </section>
    <div className="py-2"></div>
    <ControlledSwitch
      name='is_tenant'
      label={config.is_tenant.label}
      control={control}
      defaultValue={is_tenant}
      />
    </>
  )
}
