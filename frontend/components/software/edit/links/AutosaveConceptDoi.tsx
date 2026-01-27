// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import InputAdornment from '@mui/material/InputAdornment'
import {useController, useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import AutosaveSoftwareTextField from '~/components/software/edit/information/AutosaveSoftwareTextField'
import {patchSoftwareTable} from '~/components/software/edit/information/patchSoftwareTable'
import ValidateConceptDoi from './ValidateConceptDoi'
import {config} from './config'

export default function AutosaveConceptDoi() {
  const {token} = useSession()
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {control,resetField,watch} = useFormContext()
  const {fieldState:{error}} = useController({
    control,
    name: 'concept_doi'
  })
  const [id,concept_doi] = watch(['id','concept_doi'])

  // console.group('AutosaveConceptDoi')
  // console.log('id...', id)
  // console.log('concept_doi...', concept_doi)
  // console.log('error...', error)
  // console.log('disabled...', error?.ref?.name === 'concept_doi')
  // console.groupEnd()

  async function updateConceptDoi(doi:string) {
    if (doi) {
      const resp = await patchSoftwareTable({
        id,
        data: {
          concept_doi: doi
        },
        token
      })
      if (resp?.status !== 200) {
        showErrorMessage(`Failed to update concept DOI ${doi}. ${resp?.message}`)
      } else {
        // debugger
        resetField('concept_doi', {
          defaultValue:doi
        })
        // Notify user about the update
        showSuccessMessage(`Updated version DOI to Concept DOI: ${doi}`)
      }
    }
  }

  function disabledButton(){
    if (error?.ref?.name === 'concept_doi') return true
    if (!concept_doi) return true
    return false
  }

  return (
    <>
      <EditSectionTitle
        title={config.concept_doi.title}
        subtitle={config.concept_doi.subtitle}
        infoLink={config.concept_doi.infoLink}
      />

      <AutosaveSoftwareTextField
        software_id={id}
        options={{
          name: 'concept_doi',
          label: config.concept_doi.label,
          useNull: true,
          defaultValue: concept_doi,
          // helperTextMessage: config.concept_doi.help,
          // helperTextCnt: `${concept_doi?.length || 0}/${config.concept_doi.validation.maxLength.value}`,
          // add validate button as part of the input at the end
          muiProps:{
            slotProps:{
              input:{
                endAdornment:
                <InputAdornment position="end">
                  <ValidateConceptDoi
                    doi={concept_doi}
                    onUpdate={updateConceptDoi}
                    disabled={disabledButton()}
                  />
                </InputAdornment>
              }
            },
          }
        }}
        rules={config.concept_doi.validation}
      />
    </>
  )
}
