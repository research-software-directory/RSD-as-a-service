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

export default function ValidateConceptDoi({doi}: { doi: string }) {
  const {showErrorMessage,showSuccessMessage, showInfoMessage} = useSnackbar()
  const [loading,setLoading]=useState(false)

  async function validateDoi() {
    setLoading(true)
    const info = await getSoftwareVersionInfoForDoi(doi)
    if (info) {
      if (info.versionOfCount === 0) {
        showSuccessMessage(`Valid concept DOI: ${doi}`)
      } else if (info.versionOfCount === 1) {
        const conceptDoi = info.versionOf.nodes[0].doi
        showErrorMessage(`This is version DOI. The concept DOI is ${conceptDoi}`)
      }
    } else {
      showErrorMessage(`Failed to retereive version info for DOI: ${doi}. This is high likely not concept DOI.`)
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
