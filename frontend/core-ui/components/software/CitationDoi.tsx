// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useContext} from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import CopyIcon from '@mui/icons-material/ContentCopy'
import LinkIcon from '@mui/icons-material/Link'

import {copyToClipboard, canCopyToClipboard} from '../../utils/copyToClipboard'
import snackbarContext from '../snackbar/MuiSnackbarContext'
import Box from '@mui/material/Box'

export default function CitationDoi({doi}:{doi:string}) {
  const {setSnackbar} = useContext(snackbarContext)
  const canCopy = useState(canCopyToClipboard() && doi)

  async function toClipboard(){
    // copy doi to clipboard
    const copied = await copyToClipboard(doi)
    // notify user about copy action
    if (copied){
      setSnackbar({
        open:true,
        severity:'info',
        message:'Copied to clipboard',
        duration: 3000,
        anchor: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      })
    } else {
      setSnackbar({
        open:true,
        severity:'error',
        message:`Failed to copy doi ${doi} `,
        anchor: {
          vertical: 'bottom',
          horizontal: 'center'
        }
      })
    }
  }

  return (
    <div className="py-4 md:pb-8">
      <h3 className="text-sm pb-1">DOI:</h3>
      <div className="flex flex-col md:flex-row items-center">
        <Link
          href={`https://doi.org/${doi}`}
          target="_blank"
          className="w-full"
          >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              padding: '1rem 0.5rem',
              backgroundColor:'secondary.light'
            }}
          >
            {doi}
            <LinkIcon />
          </Box>
        </Link>
        <Button
          disabled={!canCopy}
          startIcon={<CopyIcon/>}
          sx={{
            display:'flex',
            justifyContent:'flex-start',
            minWidth:['15rem'],
            ml:[null,2],
            p:2
          }}
          onClick={toClipboard}
        >
          Copy DOI
        </Button>
      </div>
    </div>
  )
}
