// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FactCheckIcon from '@mui/icons-material/FactCheck'

import {softwareInformation as config} from '../editSoftwareConfig'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {getSoftwareVersionInfoForDoi} from '~/utils/getDataCite'

type ValidateConceptDoiProps = {
  doi: string,
  onUpdate:(doi:string)=>void
}

export default function ValidateConceptDoi({doi, onUpdate}: ValidateConceptDoiProps) {
  const {showErrorMessage,showSuccessMessage, showWarningMessage} = useSnackbar()
  const [loading, setLoading] = useState(false)

  async function validateDoi() {
    setLoading(true)
    const info = await getSoftwareVersionInfoForDoi(doi)
    if (info?.status === 200) {
      const {software} = info.data
      const conceptDoi = extractConceptDoiOrNull(software)
      if (conceptDoi === null) {
        showSuccessMessage(`The DOI ${doi} is a valid Concept DOI`)
      } else {
        onUpdate(conceptDoi)
        showWarningMessage(`This is a version DOI. The Concept DOI is ${conceptDoi}`)
      }
    } else {
      showErrorMessage(`Failed to retrieve info for DOI: ${doi}. ${info?.message ?? ''}`)
    }
    setLoading(false)
  }

  function extractConceptDoiOrNull(dataciteWork: any) {
    for (const relatedIdentifier of dataciteWork.relatedIdentifiers) {
      if(relatedIdentifier.relationType === 'IsVersionOf' && relatedIdentifier.relatedIdentifierType === 'DOI' && relatedIdentifier.relatedIdentifier) return relatedIdentifier.relatedIdentifier
    }
    return null
  }

  function renderStartIcon() {
    if (loading) {
      return <CircularProgress data-testid="circular-loader" color="inherit" size={20} />
    }
    return <FactCheckIcon />
  }

  if (!doi) return null

  return (
    <Button
      startIcon={renderStartIcon()}
      onClick={validateDoi}
      title={'Validate Concept DOI'}
      sx={{
        marginTop:'1rem'
      }}
    >
      { config.validateConceptDoi.label }
    </Button>
  )
}
