// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'

export default function LinkOrcidButton({orcidAuthLink,disabled}:{orcidAuthLink:string|null,disabled:boolean}) {
  if (orcidAuthLink){
    return (
      <Button
        disabled={disabled}
        href={orcidAuthLink}
        variant="outlined"
        color="info"
      >
          Link your ORCID account
      </Button>
    )
  }
  return null
}
