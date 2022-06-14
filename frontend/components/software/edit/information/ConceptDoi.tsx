// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Control, useFormState, useWatch} from 'react-hook-form'
import ControlledTextField from '~/components/form/ControlledTextField'
import {EditSoftwareItem} from '~/types/SoftwareTypes'
import {softwareInformation as config} from '../editSoftwareConfig'

import ValidateConceptDoi from './ValidateConceptDoi'

type ConceptDoiProps = {
  control: Control<EditSoftwareItem,'concept_doi'>
}

export default function ConceptDoi({control}: ConceptDoiProps) {
  const {errors} = useFormState({
    control,
    name: 'concept_doi'
  })
  const concept_doi = useWatch({
    control,
    name: 'concept_doi',
  })

  function renderValidation() {
    // concept doi value present and no validation errors
    if (concept_doi && errors.hasOwnProperty('concept_doi') === false) {
      return (
        <ValidateConceptDoi doi={concept_doi} />
      )
    }
  }

  return (
    <>
    <ControlledTextField
      options={{
        name: 'concept_doi',
        label: config.concept_doi.label,
        useNull: true,
        defaultValue: concept_doi,
        helperTextMessage: config.concept_doi.help,
        helperTextCnt: `${concept_doi?.length || 0}/${config.concept_doi.validation.maxLength.value}`,
      }}
      control={control}
      rules={config.concept_doi.validation}
      />
      {renderValidation()}
    </>
  )
}
