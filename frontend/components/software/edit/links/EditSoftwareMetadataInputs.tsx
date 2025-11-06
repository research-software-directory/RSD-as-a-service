// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'

import {EditSoftwareItem} from '~/types/SoftwareTypes'
import {ReorderedCategories, useReorderedCategories} from '~/components/category/useReorderedCategories'
import EditSection from '~/components/layout/EditSection'
import AutosaveConceptDoi from './AutosaveConceptDoi'
import AutosaveSoftwareCategories from './AutosaveSoftwareCategories'
import AutosaveSoftwareKeywords from './AutosaveSoftwareKeywords'
import AutosaveSoftwareLicenses from './AutosaveSoftwareLicenses'
import SoftwareLinksInfo from './SoftwareLinksInfo'
import GetStartedUrl from './GetStartedUrl'

export default function EditSoftwareMetadataInputs() {
  // use form context to interact with form data
  const {watch} = useFormContext<EditSoftwareItem>()
  // watch form data changes
  const [id, categoryForSoftwareIds] = watch(['id', 'categoryForSoftwareIds'])
  const reorderedCategories: ReorderedCategories = useReorderedCategories(null)

  // console.group('EditSoftwareMetadataInputs')
  // console.log('editSoftware...', editSoftware)
  // console.log('formData...', formData)
  // console.groupEnd()

  return (
    <EditSection className='xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem] py-4'>
      <div className="overflow-hidden">
        <GetStartedUrl />
        <div className="py-2"/>
        <AutosaveConceptDoi />
        <div className="py-2"/>
        <AutosaveSoftwareLicenses />
        <div className="py-2"/>
        <AutosaveSoftwareKeywords />
        {/* dynamically shown if enabled/used */}
        <AutosaveSoftwareCategories
          softwareId={id}
          reorderedCategories={reorderedCategories}
          associatedCategoryIds={categoryForSoftwareIds}
        />
      </div>
      <div className="min-w-[21rem]">
        <SoftwareLinksInfo reorderedCategories={reorderedCategories}/>
      </div>
    </EditSection>
  )
}
