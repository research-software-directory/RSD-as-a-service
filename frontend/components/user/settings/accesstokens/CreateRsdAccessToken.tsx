// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'


import copyToClipboard from '~/utils/copyToClipboard'
import {getDateFromNow, getYearMonthDay, formatDateToIsoStr, getDatePlaceholderForLocale} from '~/utils/dateFn'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {NewAccessToken} from './apiAccessTokens'

type CreateRsdAccessTokenProps=Readonly<{
  createAccessToken:(accesstoken:NewAccessToken)=>Promise<string | undefined>
}>

const displayNameHelperText = 'Give your token a unique name'
const displayNameShortText = 'Unique token name'
const expiresHelperText = 'Maximum token lifetime is 365 days'
const expiresShortText = getDatePlaceholderForLocale()

const minDate = formatDateToIsoStr(getDateFromNow(1))
const maxDate = formatDateToIsoStr(getDateFromNow(365))

export default function CreateAccessToken({createAccessToken}:CreateRsdAccessTokenProps) {
  const [displayName, setDisplayName] = useState<string>('')
  const [expires,setExpires] = useState<string>(
    getYearMonthDay(getDateFromNow(30)) ?? ''
  )
  const [tokenString, setTokenString] = useState<string | undefined>(undefined)
  const {showInfoMessage, showErrorMessage} = useSnackbar()
  const [showToken, setShowToken] = useState(false)


  async function onCreateAccessToken() {
    setTokenString(undefined)
    const accesstoken:NewAccessToken={
      display_name: displayName,
      expires_at: expires
    }
    const token_string = await createAccessToken(accesstoken)
    setTokenString(token_string)
    if (token_string) {
      setDisplayName('')
    }
  }

  const handleClick = () => {
    if (tokenString) {
      copyToClipboard(tokenString)
      showInfoMessage('Copied to clipboard')
    } else {
      showErrorMessage('Error when copying token to clipboard')
    }
  }

  const handleClickShowToken = () => setShowToken((show) => !show)

  return (
    <>
      <EditSectionTitle
        title='Create new access token'
        subtitle='To be able to access RSD entries based on your user access rights via an external application, you can create access tokens.'
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
          slotProps={{
            htmlInput:{
              min: minDate,
              max: maxDate,
            },
            inputLabel:{
              shrink: true
            }
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
        tokenString ? (
          <>
            <Alert severity="warning" sx={{margin:'0.5rem 0 1rem 0'}}>
              <AlertTitle sx={{fontWeight:500}}>Copy your generated token</AlertTitle>
              <p>
                Please note that the generated access token is only displayed to you once, and therefore needs to be copied. The maximum lifetime of a token is also limited to one year. After it expires, you need to generate a new token.
              </p>
            </Alert>
            <TextField
              type={showToken ? 'text' : 'password'}
              defaultValue={tokenString ?? ''}
              label="Token"
              variant="outlined"
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowToken}
                        aria-label={showToken ? 'hide the token' : 'display the token'}
                      >
                        {showToken ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                      <IconButton
                        onClick={handleClick}
                        aria-label='copy'
                      >
                        <ContentCopy />
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
          </>
        ) : null
      }
    </>
  )
}
