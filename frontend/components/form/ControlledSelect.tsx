import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import {Controller} from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'

export type Option = {
  label: string,
  value: string
}

export type ControlledSelectProps = {
  name: string
  label: string
  options: Option[]
  disabled: boolean
  defaultValue: any
  control: any
  rules: any
  sx?: any
  helperTextMessage:string
}

export default function ControlledSelect({name, label, options, control,
  rules, defaultValue, disabled, sx, helperTextMessage}: ControlledSelectProps) {
  // do not render if no options provided
  if (!options || options?.length === 0) return null

  return (
    <Controller
      name={name}
      defaultValue={defaultValue ?? null}
      rules={rules}
      control={control}
      render={({field}) => {
        const {onChange, value} = field
        return (
          <FormControl variant="standard" sx={sx}>
            <InputLabel id={`select-${label}`}>
              {label}
            </InputLabel>
            <Select
              id={`select-${label}`}
              label={label}
              variant='standard'
              value={value ?? ''}
              onChange={({target}:{target:any}) => {
                onChange(target.value)
              }}
              disabled={disabled}
            >
              {options.map(item => {
                return (
                  <MenuItem
                    key={item.value}
                    value={item.value}>
                    {item.label}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{helperTextMessage ?? ''}</FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}
