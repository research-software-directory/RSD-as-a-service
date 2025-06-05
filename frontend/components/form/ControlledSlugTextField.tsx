// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import MuiTextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import {styled} from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'
import {Controller} from 'react-hook-form'

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

type ControlledSlugFieldProps = {
  control: any
  rules: any
  options: {
    name: string,
    label: string,
    baseUrl: string,
    defaultValue?: string | null
    helperTextMessage?: string,
    useNull?:boolean
  }
  loading?: boolean
}

export default function ControlledSlugTextField({
  options, control, rules,loading=false}: ControlledSlugFieldProps) {

  return (
    <Controller
      name={options.name}
      defaultValue={options?.defaultValue}
      rules={rules}
      control={control}
      render={({field,fieldState}) => {
        const {onChange,value} = field
        const {error} = fieldState
        return(
          <TextField
            autoComplete='off'
            label={options.label}
            variant='outlined'
            value={value}
            slotProps={{
              input:{
                startAdornment: (
                  <InputAdornment position="start">
                    {options.baseUrl}
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
            error={error ? true: false}
            helperText={error?.message ?? options.helperTextMessage}
            onChange={({target}) => {
              // use null instead of empty string
              if (target.value === '' && options?.useNull) {
                onChange(null)
              } else {
                onChange(target.value)
              }
            }}
          />
        )
      }}
    />
  )
}

