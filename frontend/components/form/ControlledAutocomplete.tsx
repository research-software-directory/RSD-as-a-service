import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import {Controller} from 'react-hook-form'
import {AutocompleteOption} from '../../types/AutocompleteOptions'

export default function ControlledAutocomplete<T>({name,control, options, label, rules}:
  {name:string,control: any, options: AutocompleteOption<T>[], label: string, rules?: any}) {

  let allRules = {required: false}
  if (rules) {
    allRules=rules
  }
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      rules={allRules}
      render={({field}) => {
        const {onChange, value} = field
        return (
          <Autocomplete
            multiple={true}
            options={options}
            onChange={(e, items, reason) => {
              // here we pass items react-hook-form controller
              // and mui autocompletes
              onChange(items)
            }}
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
