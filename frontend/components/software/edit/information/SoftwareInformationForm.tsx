// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: EUPL-1.2

import {FormProvider, useForm} from 'react-hook-form'
import {EditSoftwareItem} from '~/types/SoftwareTypes'

import {useSession} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {softwareInformation as config} from '../editSoftwareConfig'
import AutosaveConceptDoi from './AutosaveConceptDoi'
import AutosaveSoftwareTextField from './AutosaveSoftwareTextField'
import AutosaveSoftwarePageStatus from './AutosaveSoftwarePageStatus'
import AutosaveSoftwareKeywords from './AutosaveSoftwareKeywords'
import AutosaveRepositoryUrl from './AutosaveRepositoryUrl'
import AutosaveSoftwareLicenses from './AutosaveSoftwareLicenses'
import AutosaveSoftwareMarkdown from './AutosaveSoftwareMarkdown'
import AutosaveSoftwareLogo from './AutosaveSoftwareLogo'
import AutosaveSoftwareCategories from './AutosaveSoftwareCategories'

type SoftwareInformationFormProviderProps = {
  editSoftware: EditSoftwareItem
}

export default function SoftwareInformationForm({editSoftware}: SoftwareInformationFormProviderProps) {
  const {user} = useSession()
  const methods = useForm<EditSoftwareItem>({
    mode: 'onChange',
    defaultValues: {
      ...editSoftware
    }
  })
  const {
    register, watch, formState
  } = methods
  // destructure formState (subscribe to changes)
  const {dirtyFields} = formState
  // watch form data changes (we use reset in useEffect)
  const formData = watch()

  // console.group('SoftwareInformationForm')
  // console.log('editSoftware...', editSoftware)
  // console.log('formData...', formData)
  // console.groupEnd()

  return (
    <FormProvider {...methods}>
      <form
        data-testid="software-information-form"
        id="software-information"
        // onSubmit={handleSubmit(onSubmit)}
        className='flex-1'>
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id', {required:'id is required'})}
        />
        <EditSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0 xl:gap-[3rem]'>
          <div className="py-4 overflow-hidden">
            <EditSectionTitle
              title="Software information"
            />
            {user?.role === 'rsd_admin' ?
              <>
                <div className="py-2"></div>
                <AutosaveSoftwareTextField
                  software_id={formData.id}
                  options={{
                    name: 'slug',
                    label: config.slug.label,
                    useNull: true,
                    defaultValue: editSoftware?.slug,
                    helperTextMessage: config.slug.help,
                    helperTextCnt: `${editSoftware?.slug?.length || 0}/${config.slug.validation.maxLength.value}`,
                  }}
                  rules={config.slug.validation}
                />
              </>
              :
              <input type="hidden"
                {...register('slug', {required:'slug is required'})}
              />
            }
            <div className="py-2"></div>
            <AutosaveSoftwareTextField
              software_id={formData.id}
              options={{
                name: 'brand_name',
                label: config.brand_name.label,
                useNull: true,
                defaultValue: editSoftware?.brand_name,
                helperTextMessage: config.brand_name.help,
                helperTextCnt: `${formData?.brand_name?.length || 0}/${config.brand_name.validation.maxLength.value}`,
              }}
              rules={config.brand_name.validation}
            />
            <div className="py-2"></div>
            <AutosaveSoftwareTextField
              software_id={formData.id}
              options={{
                name: 'short_statement',
                label: config.short_statement.label,
                multiline: true,
                maxRows: 5,
                useNull: true,
                defaultValue: editSoftware?.short_statement,
                helperTextMessage: config.short_statement.help,
                helperTextCnt: `${formData?.short_statement?.length || 0}/${config.short_statement.validation.maxLength.value}`,
              }}
              rules={config.short_statement.validation}
            />
            <div className="py-2"></div>
            <EditSectionTitle
              title='Software URLs'
              subtitle='Where can users find information to start?'
            />
            <AutosaveSoftwareTextField
              software_id={formData.id}
              options={{
                name: 'get_started_url',
                label: config.get_started_url.label,
                useNull: true,
                defaultValue: editSoftware?.get_started_url,
                helperTextMessage: config.get_started_url.help,
                helperTextCnt: `${formData?.get_started_url?.length || 0}/${config.get_started_url.validation.maxLength.value}`,
              }}
              rules={config.get_started_url.validation}
            />
            <div className="py-2"></div>
            <AutosaveRepositoryUrl />
            <div className="py-2"></div>
            <AutosaveSoftwareMarkdown />
            {/* add white space at the bottom */}
            <div className="xl:py-4"></div>
          </div>
          <div className="py-4 min-w-[21rem] xl:my-0">
            <AutosaveSoftwarePageStatus />
            <div className="py-4"></div>
            <AutosaveConceptDoi />
            <div className="py-4"></div>
            <AutosaveSoftwareLogo />
            <div className="py-4"></div>
            <AutosaveSoftwareCategories
              softwareId={formData.id}
              categories={formData.categories}
              />
            <div className="py-4"></div>
            <AutosaveSoftwareKeywords
              software_id={formData.id}
              concept_doi={formData.concept_doi ?? undefined}
              items={formData.keywords ?? []}
            />
            <div className="py-4"></div>
            <AutosaveSoftwareLicenses
              items={formData.licenses}
              concept_doi={formData.concept_doi ?? undefined}
            />
            {/* add white space at the bottom */}
            <div className="py-4"></div>
          </div>
        </EditSection>
      </form>
    </FormProvider>
  )
}
