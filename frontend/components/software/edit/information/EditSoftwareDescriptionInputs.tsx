// SPDX-FileCopyrightText: 2023 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'
import {EditSoftwareItem} from '~/types/SoftwareTypes'

import {useSession} from '~/auth/AuthProvider'
import EditSection from '~/components/layout/EditSection'
import {softwareInformation as config} from '../editSoftwareConfig'
import AutosaveSoftwareTextField from './AutosaveSoftwareTextField'
import AutosaveSoftwarePageStatus from './AutosaveSoftwarePageStatus'
import AutosaveSoftwareMarkdown from './AutosaveSoftwareMarkdown'
import AutosaveSoftwareLogo from './AutosaveSoftwareLogo'

/**
 * SoftwareDescription requires FormContext<EditSoftwareItem> from react-hook-form
 * to be implemented at the parent component
 * @returns JSX.Elements
 */
export default function EditSoftwareDescriptionInputs() {
  const {user} = useSession()
  const {register, watch} = useFormContext<EditSoftwareItem>()
  // watch for changes in form variables
  const [id,slug,brand_name,short_statement] = watch(['id','slug','brand_name','short_statement'])

  // console.group('EditSoftwareDescriptionInputs')
  // console.log('id...', id)
  // console.log('slug...', slug)
  // console.groupEnd()

  return (
    <EditSection className='md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_1fr] xl:px-0 xl:gap-[3rem]'>
      <div className="py-2">
        {user?.role === 'rsd_admin' ?
          <>
            <AutosaveSoftwareTextField
              software_id={id}
              options={{
                name: 'slug',
                label: config.slug.label,
                useNull: true,
                defaultValue: slug,
                helperTextMessage: config.slug.help,
                helperTextCnt: `${slug?.length || 0}/${config.slug.validation.maxLength.value}`,
              }}
              rules={config.slug.validation}
            />
            <div className="py-3"></div>
          </>
          :
          <input type="hidden"
            {...register('slug', {required:'slug is required'})}
          />
        }
        <AutosaveSoftwareTextField
          software_id={id}
          options={{
            name: 'brand_name',
            label: config.brand_name.label,
            useNull: true,
            defaultValue: brand_name,
            helperTextMessage: config.brand_name.help,
            helperTextCnt: `${brand_name?.length || 0}/${config.brand_name.validation.maxLength.value}`,
          }}
          rules={config.brand_name.validation}
        />
        <div className="py-3"></div>
        <AutosaveSoftwareTextField
          software_id={id}
          options={{
            name: 'short_statement',
            label: config.short_statement.label,
            multiline: true,
            maxRows: 5,
            useNull: true,
            defaultValue: short_statement,
            helperTextMessage: config.short_statement.help,
            helperTextCnt: `${short_statement?.length || 0}/${config.short_statement.validation.maxLength.value}`,
          }}
          rules={config.short_statement.validation}
        />
        <div className="py-2"></div>
        <AutosaveSoftwareMarkdown />
        {/* add white space at the bottom */}
        {/* <div className="xl:py-3"></div> */}
      </div>
      <div className="py-2 min-w-[21rem]">
        <AutosaveSoftwarePageStatus />
        <div className="py-6"></div>
        <AutosaveSoftwareLogo />
        {/* add white space at the bottom for mobile */}
        <div className="py-4"></div>
      </div>
    </EditSection>
  )
}
