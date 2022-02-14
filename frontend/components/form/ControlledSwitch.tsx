import {Controller} from 'react-hook-form'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

export default function ControlledSwitch({label, name, defaultValue = false, rules, control}:
  { label: string, name: string, control: any, rules?: any, defaultValue?: boolean }) {
  // console.log('ControlledSwitch.defaultValue...', defaultValue)
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      // rules={rules}
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
              />
            }
            label={label}
          />
        )
      }}
    />
  )
}
