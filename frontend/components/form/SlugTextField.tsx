// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import MuiTextField, {TextFieldProps} from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
// import styled from '@mui/material/styles/styled'
import {styled} from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'

const TextField = styled(MuiTextField)(({theme}) => ({
  width: '100%',
  '& .MuiInputLabel-root': {
    left:'-4px',
    top:'-4px',
    backgroundColor: theme.palette.background.default,
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    border:`1px solid ${theme.palette.divider}`
    // color: theme.palette.primary.contrastText
  },
  '& .MuiOutlinedInput-root': {
    paddingLeft: 0,
  },
  '& .MuiInputAdornment-root': {
    backgroundColor: theme.palette.grey[100],
    padding: '1.75rem 0rem 1.75rem 1rem',
    borderTopLeftRadius: theme.shape.borderRadius + 'px',
    borderBottomLeftRadius: theme.shape.borderRadius + 'px',
    marginRight:0
  },
}))

type SlugFieldProps = {
  baseUrl: string,
  loading: boolean,
  options: TextFieldProps,
  register: any
}

export default function SlugTextField({
  baseUrl,loading = true,options,register
}: SlugFieldProps) {

  return (
    <TextField
      // default options
      autoComplete='off'
      variant='outlined'
      slotProps={{
        input:{
          startAdornment: (
            <InputAdornment position="start">
              {baseUrl}
            </InputAdornment>
          ),
          endAdornment: (
            loading ?
              <div>
                <CircularProgress data-testid="slug-circular-progress" color="primary" size={32} />
              </div>
              : null
          )
        }
      }}
      {...options}
      {...register}
    />
  )
}
