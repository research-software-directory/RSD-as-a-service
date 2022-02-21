import TextField from '@mui/material/TextField'
import Autocomplete, {AutocompleteRenderGetTagProps} from '@mui/material/Autocomplete'
import {Controller} from 'react-hook-form'
import {AutocompleteOptionWithLink} from '../../types/AutocompleteOptions'
import {Chip} from '@mui/material'

export default function ControlledAutocompleteWithLink<T>({name,control, options, label, rules}:
  {name:string,control: any, options: AutocompleteOptionWithLink<T>[], label: string, rules?: any}) {

  let allRules = {required: false}
  if (rules) {
    allRules=rules
  }

  function renderTags(values: AutocompleteOptionWithLink<T>[],getTagProps:AutocompleteRenderGetTagProps) {
    return values.map((item, index) => {
      // debugger
      const props = getTagProps({index})
      return (
         // eslint-disable-next-line react/jsx-key
        <Chip
          clickable
          label={
            <a href={item.link} target="_blank" rel="noreferrer">{item.label}</a>
          }
          {...getTagProps({index})}
        />
      )
    })
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
              option: AutocompleteOptionWithLink<T>,
              value: AutocompleteOptionWithLink<T>) => {
              if (value) {
                // we compare key values
                return option.key === value.key
              }
              return false
            }}
            renderTags={renderTags}
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
