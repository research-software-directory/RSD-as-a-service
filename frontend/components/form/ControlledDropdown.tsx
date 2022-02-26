import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import {Controller} from 'react-hook-form'
import {AutocompleteOption} from '../../types/AutocompleteOptions'

type ControlledDropdownType<T> = {
  name: string,
  control: any,
  options: AutocompleteOption<T>[],
  label: string,
  rules?: any,
  defaultValue?: AutocompleteOption<T> | null
}

export default function ControlledDropdown<T>({
  name, control, options, label, rules, defaultValue = null
}: ControlledDropdownType<T>) {
  let allRules = {required: false}
  if (rules) {
    allRules=rules
  }
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={allRules}
      render={({field}) => {
        const {onChange, value} = field
        // console.log('ControlledDropdown...value...', value)
        return (
          <Autocomplete
            options={options}
            onChange={(e, items, reason) => {
              // here we pass items react-hook-form controller
              // and mui autocompletes
              // debugger
              onChange(items)
            }}
            value={value}
            isOptionEqualToValue={(
              option: AutocompleteOption<T>,
              value: AutocompleteOption<T>) => {
              if (value) {
                // debugger
                // we compare key values
                return option.key === value?.key
              }
              return false
            }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={label}
                  variant="standard"
                />
              )
            }}
          />
        )
      }}
    />
  )
}
