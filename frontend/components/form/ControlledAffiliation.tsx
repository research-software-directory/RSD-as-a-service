import {Controller} from 'react-hook-form'

import {AutocompleteOption} from '~/types/AutocompleteOptions'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

type ControlledFreeSoloProps = {
  name: string,
  label: string,
  affiliations: string,
  control: any,
  rules: any,
  helperTextMessage: string
}

export default function ControlledAffiliation({
  name, control, affiliations, label, rules, helperTextMessage
}: ControlledFreeSoloProps) {
  let allRules = {required: false}
  if (rules) {
    allRules=rules
  }
  // ORCID api returns all affitiations as string (;) separated
  // in that case we create dropdown with affiliation options
  const options: AutocompleteOption<string>[] = affiliations.split(';').map(item => ({
    key: item.trim(),
    label: item.trim(),
    data: item.trim()
  }))

  // default is null or first option
  let defaultValue = null
  if (options.length > 1) defaultValue = options[0]

  return (
    <Controller
      name={name}
      control={control}
      rules={allRules}
      defaultValue={defaultValue}
      render={({field}) => {
        const {onChange, value} = field
        // use text input if no options
        if (options.length < 2) {
          return (
            <TextField
              label={label}
              variant="standard"
              value={value}
              onChange={({target}) => {
              // use null instead of empty string
                if (target.value === '') {
                  onChange(null)
                } else {
                  onChange(target.value)
                }
              }}
              helperText={helperTextMessage}
            />
          )
        } else {
          // ORCID affitiations
          // NOTE! we save only string value in controller
          // and we convert it back to option here
          const option = {
            key: value,
            label: value,
            data: value
          }
          return (
            <Autocomplete
              freeSolo={true}
              multiple={false}
              options={options}
              onInputChange={(e, value) => {
                // debugger
                onChange(value)
              }}
              onChange={(e, item, reason) => {
                // here we pass items react-hook-form controller
                // and mui autocompletes
                // debugger
                if (typeof item === 'string' || item === null) {
                  onChange(item)
                } else {
                  onChange(item?.label)
                }
              }}
              value={option}
              getOptionLabel={(option) => option.label ? option.label : ''}
              isOptionEqualToValue={(
                option: AutocompleteOption<string>,
                value: AutocompleteOption<string>) => {
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
                    helperText={helperTextMessage}
                  />
                )
              }}
            />
          )
        }
      }}
    />
  )
}
