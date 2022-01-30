import TextField from '@mui/material/TextField'
import HelperTextWithCounter from './HelperTextWithCounter'

type TextFieldWidthCounterType = {
  autoComplete?: string
  multiline?: boolean
  maxRows?: number
  error?: boolean
  label: string
  type?: string
  fullWidth?: boolean
  variant?: string
  defaultValue?:string
  helperTextMessage?: string
  helperTextCnt?: string
}

export default function TextFieldWithCounter({options, register}:
  { options: TextFieldWidthCounterType, register: any}) {

  return (
    <TextField
      autoComplete={options?.autoComplete ?? 'off'}
      multiline={options?.multiline ?? false}
      maxRows={options?.maxRows ?? undefined}
      error={options?.error ?? false}
      id={options?.label ?? `input-${Math.floor(Math.random()*10000)}`}
      label={options?.label ?? 'Label not provided'}
      type={options?.type ?? 'text'}
      fullWidth={options?.fullWidth ?? true }
      variant={options?.variant ?? 'standard'}
      defaultValue={options?.defaultValue ?? ''}
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
