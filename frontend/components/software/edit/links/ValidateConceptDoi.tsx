// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FactCheckIcon from '@mui/icons-material/FactCheck'

import {getSoftwareVersionInfoForDoi} from '~/utils/getDataCite'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {config} from './config'

type ValidateConceptDoiProps = {
  doi: string,
  onUpdate:(doi:string)=>void
  disabled: boolean
}

type DataciteWorkType = {
  relatedIdentifiers: {
    relationType: string,
    relatedIdentifierType: string,
    relatedIdentifier: string,
  }[]
}

export default function ValidateConceptDoi({doi, onUpdate, disabled}: ValidateConceptDoiProps) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const [loading, setLoading] = useState(false)

  async function validateDoi() {
    setLoading(true)
    const info = await getSoftwareVersionInfoForDoi(doi)
    if (info?.status === 200) {
      const {software} = info.data
      const conceptDoi = extractConceptDoi(software)
      if (conceptDoi === null) {
        showSuccessMessage(`The DOI ${doi} is a valid Concept DOI`)
      } else {
        // update version DOI with concept DOI
        onUpdate(conceptDoi)
      }
    } else {
      showErrorMessage(`Failed to retrieve info for DOI: ${doi}. ${info?.message ?? ''}`)
    }
    setLoading(false)
  }

  function extractConceptDoi(dataciteWork: DataciteWorkType) {
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

  return (
    <Button
      variant="contained"
      startIcon={renderStartIcon()}
      onClick={validateDoi}
      title={'Validate DOI'}
      sx={{
        // marginTop:'1rem'
        minWidth: 'inherit',
        whiteSpace: 'nowrap'
      }}
      disabled={disabled}
    >
      { config.validateConceptDoi.label }
    </Button>
  )
}
