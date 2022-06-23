// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
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
      if (software.versionOfCount === 0) {
        showSuccessMessage(`The DOI ${doi} is a valid Concept DOI`)
      } else if (software.versionOfCount === 1) {
        const concept = software.versionOf.nodes[0].doi
        if (concept) {
          onUpdate(concept)
        }
        showWarningMessage(`This is a version DOI. The Concept DOI is ${concept}`)
      }
    } else {
      showErrorMessage(`Failed to retrieve info for DOI: ${doi}. ${info?.message ?? ''}`)
    }
    setLoading(false)
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
