// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'
import EditSoftwareDescriptionInputs from './EditSoftwareDescriptionInputs'
import {EditSoftwareDescriptionProps} from './useSoftwareTable'


/**
 * Implement FormProvider (shared form context) of react-hook-form.
 * The form context can be then used in any child component to retreive/update form data.
 * @param param0
 * @returns
 */
export default function EditSoftwareDescriptionForm({data}:{data:EditSoftwareDescriptionProps}) {
  const methods = useForm<EditSoftwareDescriptionProps>({
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
        <EditSoftwareDescriptionInputs />
      </form>
    </FormProvider>
  )
}
