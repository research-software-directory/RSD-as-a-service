import {useEffect, useRef} from 'react'
import TextField from '@mui/material/TextField'
import HelperTextWithCounter from './HelperTextWithCounter'

type TextFieldWidthCounterType = {
  autofocus?:boolean
  autoComplete?: string
  multiline?: boolean
  rows?: number,
  maxRows?: number
  error?: boolean
  label: string
  type?: string
  fullWidth?: boolean
  variant?: string
  defaultValue?:string
  helperTextMessage?: string
  helperTextCnt?: string
  disabled?: boolean
}

export default function TextFieldWithCounter({options, register}:
  { options: TextFieldWidthCounterType, register: any }) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (options.autofocus === true && inputRef.current) {
      inputRef.current?.focus()
    }
  },[options.autofocus])

  return (
    <TextField
      inputRef={inputRef}
      disabled={options?.disabled ?? false}
      autoComplete={options?.autoComplete ?? 'off'}
      multiline={options?.multiline ?? false}
      rows={options?.rows ?? undefined}
      maxRows={options?.maxRows ?? undefined}
      error={options?.error ?? false}
      id={options?.label ?? `input-${Math.floor(Math.random()*10000)}`}
      label={options?.label ?? 'Label not provided'}
      type={options?.type ?? 'text'}
      fullWidth={options?.fullWidth ?? true }
      variant={options?.variant ?? 'standard'}
      defaultValue={options?.defaultValue ?? null}
      FormHelperTextProps={{
        sx:{
          display: 'flex',
          justifyContent:'space-between'
        }
      }}
      helperText={
        <HelperTextWithCounter
          message={options?.helperTextMessage ?? ''}
          count={options?.helperTextCnt ?? ''}
        />
      }
      {...register}
    />
  )
}
