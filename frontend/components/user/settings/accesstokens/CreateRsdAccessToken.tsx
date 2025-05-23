// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'


import {getDateFromNow, getYearMonthDay, formatDateToIsoStr} from '~/utils/dateFn'
import copyToClipboard from '~/utils/copyToClipboard'
import {NewAccessToken} from './apiAccessTokens'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {ContentCopy} from '@mui/icons-material'
import useSnackbar from '~/components/snackbar/useSnackbar'


type CreateRsdAccessTokenProps=Readonly<{
  createAccessToken:(accesstoken:NewAccessToken)=>Promise<string>
}>

const displayNameHelperText = 'Give your token a unique name'
const displayNameShortText = 'Unique token name'
const expiresHelperText = 'Maximum token lifetime is 365 days'
const expiresShortText = 'Month / Day / Year'

const today = new Date()
const minDate = formatDateToIsoStr(today)
const maxDate = formatDateToIsoStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 365))

export default function CreateAccessToken({createAccessToken}:CreateRsdAccessTokenProps) {
  const [displayName, setDisplayName] = useState<string>('')
  const [expires,setExpires] = useState<string>(
    getYearMonthDay(getDateFromNow(30)) ?? ''
  )
  const [tokenString, setTokenString] = useState<string>('')
  const {showInfoMessage} = useSnackbar()


  async function onCreateAccessToken() {
    const accesstoken:NewAccessToken={
      display_name: displayName,
      expires_at: expires
    }
    const token_string = await createAccessToken(accesstoken)
    setTokenString(token_string)
  }

  const handleClick = () => {
    copyToClipboard(tokenString)
    showInfoMessage('Copied to clipboard')
  }

  return (
    <>
      <EditSectionTitle
        title='Create new access token'
      />
      <div className="flex gap-4 py-4">
        <TextField
          type="text"
          fullWidth
          className='w-1/2'
          label="Token name"
          value={displayName ?? ''}
          helperText={
            <span className="line-clamp-1" title={displayNameHelperText}>{displayNameShortText}</span>
          }
          onChange={({target})=>{setDisplayName(target.value)}}
        />
        <TextField
          type="date"
          fullWidth
          className='w-1/2'
          label="Expiration date"
          value={expires}
          InputLabelProps={{shrink: true}}
          inputProps={{
            min: minDate,
            max: maxDate,
          }}
          helperText={
            <span className="line-clamp-1" title={expiresHelperText}>{expiresShortText}</span>
          }
          onChange={({target})=>{
            setExpires(target.value)
          }}
        />
      </div>
      <Button
        disabled={expires==='' || displayName===''}
        variant='contained'
        sx={{
          margin: '1rem 0rem 2rem 0rem',
          display: 'flex',
          alignItems: 'center'
        }}
        startIcon={<AutoFixHighIcon />}
        onClick={onCreateAccessToken}
      >
        Create Access Token
      </Button>
      {
        (tokenString !== '') ? (
          <>
            <TextField
              defaultValue={tokenString}
              label="Token"
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClick}
                      edge="end"
                      aria-label='copy'
                    >
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        ) : null
      }
    </>
  )
}
