import {Controller} from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

type ControlledSwitchProps = {
  label: string,
  name: string,
  control: any,
  defaultValue?: boolean
  disabled?: boolean
}


export default function ControlledSwitch({label, name, defaultValue = false, control, disabled=false}:ControlledSwitchProps) {
  // console.log('ControlledSwitch.defaultValue...', defaultValue)
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({field}) => {
        const {onChange, value} = field
        // console.log('ControlledSwitch.value...', value)
        return (
          <FormControlLabel
            control={
              <Switch
                checked={value}
                onChange={({target}) => {
                  onChange(target.checked)
                }}
                disabled={disabled ?? false}
              />
            }
            label={label}
          />
        )
      }}
    />
  )
}
