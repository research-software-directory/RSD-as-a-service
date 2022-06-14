// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

import {contributorInformation as config} from '../editSoftwareConfig'

export default function GetContributorsFromDoi(
  {onClick, title}: { onClick: () => void,title?:string}
) {
  return (
    <Button
      startIcon={<DownloadIcon />}
      onClick={onClick}
      title={title ?? ''}
      sx={{
        marginTop: '1rem'
      }}
    >
      { config.importContributors.label }
    </Button>
  )
}
