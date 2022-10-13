// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import {useState} from 'react'
import {useController, useFormContext} from 'react-hook-form'
import {softwareInformation as config} from '../editSoftwareConfig'

import ValidateConceptDoi from './ValidateConceptDoi'
import UpdateIcon from '@mui/icons-material/Sync'
import AutosaveSoftwareTextField from './AutosaveSoftwareTextField'
import {patchSoftwareTable} from './patchSoftwareTable'
import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'

export default function AutosaveConceptDoi() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {control,resetField,watch} = useFormContext()
  const {fieldState:{error}} = useController({
    control,
    name: 'concept_doi'
  })
  const [updateDoi, setUpdateDoi] = useState<string>()
  const [id,concept_doi] = watch(['id','concept_doi'])

  // console.group('ConceptDoi')
  // console.log('id...', id)
  // console.log('concept_doi...', concept_doi)
  // console.log('error...', error)
  // console.groupEnd()

  async function updateConceptDoi() {
    if (updateDoi) {
      const resp = await patchSoftwareTable({
        id,
        data: {
          concept_doi: updateDoi
        },
        token
      })
      if (resp?.status !== 200) {
        showErrorMessage(`Failed to update concept doi. ${resp?.message}`)
      } else {
        // debugger
        resetField('concept_doi', {
          defaultValue:updateDoi
        })
        // setValue('concept_doi', updateDoi, {shouldValidate: true, shouldDirty: true})
        // remove value to hide update button
        setUpdateDoi(undefined)
      }
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
    if (concept_doi && typeof error == 'undefined') {
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
      <EditSectionTitle
        title={config.concept_doi.title}
        subtitle={config.concept_doi.subtitle}
      />
      <AutosaveSoftwareTextField
        software_id={id}
        options={{
        name: 'concept_doi',
        label: config.concept_doi.label,
        useNull: true,
        defaultValue: concept_doi,
        helperTextMessage: config.concept_doi.help,
        helperTextCnt: `${concept_doi?.length || 0}/${config.concept_doi.validation.maxLength.value}`,
      }}
      rules={config.concept_doi.validation}
      />
      {renderValidation()}
    </>
  )
}
