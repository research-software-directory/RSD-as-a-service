// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Box from '@mui/material/Box'

import {useSession} from '~/auth/AuthProvider'
import ImportDialogTitle from './ImportDialogTitle'
import ImportDialogActions from './ImportDialogActions'
import {DoiBulkImportReport} from './apiImportMentions'
import useValidateInputList from './useValidateInputList'
import config from './config'

type DoiInputDialogBodyProps = {
  onCancel:()=>void
  onSubmit:(searchResults:DoiBulkImportReport)=>void
}

export default function DoiInputDialogBody({onCancel, onSubmit}: DoiInputDialogBodyProps) {
  const {token} = useSession()
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState({
    count: 0,
    message: ''
  })
  const {validating, validateInput} = useValidateInputList(token)

  async function onValidateInput() {
    const searchResults = await validateInput(value)
    onSubmit(searchResults)
  }

  function onSetValue({target}:{target:any}) {
    const count = target.value.split(/\r\n|\n|\r/).length
    if (count > config.doiInput.maxRows) {
      setError({
        count,
        message: `${config.doiInput.maxRowsErrorMsg} `
      })
    } else {
      setError({
        count,
        message: ''
      })
    }
    setValue(target.value)
  }

  return (
    <>
      <ImportDialogTitle
        title={'Import publications'}
      />
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0rem 1rem',
        }}
      >
        <TextField
          multiline={true}
          fullWidth={true}
          sx={{
            flex: 1,
            margin: '1rem 0rem',
            '& .MuiInputBase-root': {
              flex: 1,
              alignItems: 'stretch',
              padding: '0.75rem 0.25rem 0.75rem 1rem'
            }
          }}
          value={value}
          label={config.doiInput.label}
          error={error.message!==''}
          onChange={onSetValue}
        >
        </TextField>
      </DialogContent>
      <ImportDialogActions>
        <div className={`flex-1 flex gap-4 text-sm ${error.message ? 'text-error ' : 'text-base-content-disabled'}` }>
          <span>{error.message ? error.message : config.doiInput.helperText}...{`${error.count}/${config.doiInput.maxRows}`}</span>
        </div>
        <div>
          <Button
            tabIndex={1}
            onClick={onCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            endIcon={<NavigateNextIcon />}
            tabIndex={0}
            disabled={value.length===0 || error.message!==''}
            onClick={onValidateInput}
          >
            Next
          </Button>
        </div>
      </ImportDialogActions>
      {validating &&
        <Box sx={{
          position: 'absolute',
          left: 0, right: 0,
          top: 0, bottom: 0,
          cursor: 'wait',
          zIndex: 1
        }} />
      }
    </>
  )
}
