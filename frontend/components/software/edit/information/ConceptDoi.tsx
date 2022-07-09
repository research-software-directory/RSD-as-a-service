// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import {useState} from 'react'
import {Control, UseFormSetValue, useFormState, useWatch} from 'react-hook-form'
import ControlledTextField from '~/components/form/ControlledTextField'
import {EditSoftwareItem} from '~/types/SoftwareTypes'
import {softwareInformation as config} from '../editSoftwareConfig'

import ValidateConceptDoi from './ValidateConceptDoi'
import UpdateIcon from '@mui/icons-material/Sync'

type ConceptDoiProps = {
  control: Control<EditSoftwareItem, object>
  setValue: UseFormSetValue<EditSoftwareItem>
}

export default function ConceptDoi({control, setValue}: ConceptDoiProps) {
  const [updateDoi, setUpdateDoi] = useState<string>()
  const {errors} = useFormState({
    control,
    name: 'concept_doi'
  })
  const concept_doi = useWatch({
    control,
    name: 'concept_doi',
  })

  // console.group('ConceptDoi')
  // console.log('concept_doi...', concept_doi)
  // console.log('errors...', errors)
  // console.groupEnd()

  function updateConceptDoi() {
    if (updateDoi) {
      setValue('concept_doi', updateDoi, {shouldValidate: true, shouldDirty: true})
      // remove value to hide update button
      setUpdateDoi(undefined)
    }
  }

  function renderValidation() {
    // we have concept doi to update
    if (updateDoi) {
      return (
        <Button
          startIcon={<UpdateIcon />}
          onClick={updateConceptDoi}
          title={'Update Concept DOI'}
          sx={{
            marginTop:'1rem'
          }}
        >
          update concept doi
        </Button>
      )
    }
    // concept doi value present and no validation errors
    if (concept_doi &&
      errors.hasOwnProperty('concept_doi') === false) {
      return (
        <ValidateConceptDoi
          doi={concept_doi}
          onUpdate={setUpdateDoi}
        />
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
