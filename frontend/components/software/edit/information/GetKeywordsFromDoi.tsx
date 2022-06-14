// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DownloadIcon from '@mui/icons-material/Download'

import {softwareInformation as config} from '../editSoftwareConfig'

export default function GetKeywordsFromDoi(
  {onClick, title, loading=false}:
  {onClick: () => void, title?: string, loading?: boolean}
) {

  function renderStartIcon() {
    if (loading) {
      return <CircularProgress data-testid="circular-loader" color="inherit" size={20} />
    }
    return <DownloadIcon />
  }

  return (
    <Button
      startIcon={renderStartIcon()}
      onClick={onClick}
      title={title ?? ''}
    >
      { config.importKeywords.label }
    </Button>
  )
}
