// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'
import {CategoriesForSoftware, EditSoftwareItem, KeywordForSoftware, License} from '~/types/SoftwareTypes'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import EditSoftwareMetadataInputs from './EditSoftwareMetadataInputs'

type EditSoftwareMetadataFormProps={
  id: string
  get_started_url: string | null
  concept_doi: string | null,
  licenses: AutocompleteOption<License>[]
  keywords: KeywordForSoftware[]
  categories: CategoriesForSoftware
  categoryIds: Set<string>
}

/**
 * Implement FormProvider (shared form context) of react-hook-form.
 * The form context can be then used in any child component to retrieve/update form data.
 * @param param0
 * @returns
 */
export default function EditSoftwareMetadataForm({data}:{data:EditSoftwareItem}) {
  const methods = useForm<EditSoftwareMetadataFormProps>({
    mode: 'onChange',
    defaultValues: {
      ...data
    }
  })
  return (
    <FormProvider {...methods}>
      <form
        data-testid="software-information-form"
        id="software-information"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...methods.register('id', {required:'id is required'})}
        />
        {/* autosave input components collection */}
        <EditSoftwareMetadataInputs />
      </form>
    </FormProvider>
  )
}
