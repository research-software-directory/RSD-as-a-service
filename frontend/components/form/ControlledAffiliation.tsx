// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {Controller} from 'react-hook-form'

import {AutocompleteOption} from '~/types/AutocompleteOptions'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

type ControlledFreeSoloProps = {
  name: string,
  label: string,
  affiliation: string | null,
  institution: string[] | null,
  control: any,
  rules: any,
  helperTextMessage: string
}

export default function ControlledAffiliation({
  name, control, affiliation, institution, label, rules, helperTextMessage
}: ControlledFreeSoloProps) {
  const [open, setOpen] = useState(false)

  let allRules = {required: false}
  if (rules) {
    allRules=rules
  }

  let defaultValue = ''

  // ORCID api returns institution as string[]
  // in that case we create dropdown with options
  let options:AutocompleteOption<string>[]=[]
  if (institution) {
    options = institution.map(item => ({
      key: item.trim(),
      label: item.trim(),
      data: item.trim()
    }))
    // select first item
    if (options.length > 0) {
      defaultValue = options[0].label
    }
  }

  if (affiliation) {
    // one string value
    defaultValue = affiliation
  }

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
              value={value ?? ''}
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
              open={open}
              onOpen={() => {
                setOpen(true)
              }}
              onClose={() => {
                setOpen(false)
              }}
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
              getOptionLabel={(option) => typeof option === 'string' ? option : option?.label}
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
                    onFocus={()=>setOpen(true)}
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
