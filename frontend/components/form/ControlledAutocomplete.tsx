import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import {Controller} from 'react-hook-form'
import {AutocompleteOption} from '../../types/AutocompleteOptions'

type ControlledAutocompleteType<T>={
  name: string,
  control: any,
  options: AutocompleteOption<T>[],
  label: string,
  rules?: any,
  defaultValue?: AutocompleteOption<T>[],
  onChange?: any
}

export default function ControlledAutocomplete<T>(
  {
    name, control, options, label, rules, defaultValue = [], onChange
  }: ControlledAutocompleteType<T>
) {
  let overrideOnChange: any = undefined
  let allRules = {required: false}

  if (rules) {
    allRules = rules
  }

  if (onChange) {
    overrideOnChange = onChange
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={allRules}
      render={({field}) => {
        const {onChange, value} = field
        return (
          <Autocomplete
            multiple={true}
            options={options}
            onChange={
              overrideOnChange
                ? overrideOnChange
                : (e, items, reason) => {
                  // here we pass items react-hook-form controller
                  // and mui autocompletes
                  onChange(items)
                }
            }
            value={value}
            isOptionEqualToValue={(
              option: AutocompleteOption<T>,
              value: AutocompleteOption<T>) => {
              if (value) {
                // we compare key values
                return option.key === value.key
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
