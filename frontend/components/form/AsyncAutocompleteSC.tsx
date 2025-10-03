// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState, ReactNode, HTMLAttributes, SyntheticEvent, useEffect} from 'react'
import Autocomplete, {AutocompleteChangeReason, AutocompleteInputChangeReason, AutocompleteRenderOptionState} from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import {FilterOptionsState} from '@mui/material/useAutocomplete'
import TextField from '@mui/material/TextField'

import {useDebounce} from '~/utils/useDebounce'

export type AutocompleteOption<T> = {
  key: string
  label: string
  data: T
  // capture new input value
  input?: string
}

export type AsyncAutocompleteConfig = {
  // enables creation of new items
  freeSolo: boolean
  forceShowAdd?: boolean,
  minLength: number,
  label: string,
  help: string,
  reset?: boolean,
  clearText?: string,
  // makes help text red on true
  error?: boolean
  noOptions?: {
    empty: string,
    minLength: string,
    notFound: string,
    loading?: string
  }
  // text field layout variant
  variant?: 'standard'|'outlined'|'filled'
}

type AsyncAutocompleteProps<T> = {
  status: {
    loading: boolean,
    foundFor: string | undefined
  },
  options: AutocompleteOption<T>[]
  onSearch: (searchFor:string) => void
  onAdd: (option: AutocompleteOption<T>) => void
  onCreate?: (inputValue: string) => void
  onRenderOption: (
    props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<T>,
    state: AutocompleteRenderOptionState
  ) => ReactNode
  config: AsyncAutocompleteConfig,
  defaultValue?: AutocompleteOption<T>
  onClear?: () => void
}


export default function AsyncAutocompleteSC<T>({status, options, config,
  onSearch, onAdd, onCreate, onClear, onRenderOption, defaultValue}: AsyncAutocompleteProps<T>) {
  const [open, setOpen] = useState(false)
  const [newInputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<AutocompleteOption<T>|null>(null)
  const searchFor = useDebounce(newInputValue, 700)
  const [processing, setProcessing] = useState('')
  const {loading, foundFor} = status

  useEffect(() => {
    // if we have search term at least minLength long
    // and search term is different from one we already processing
    // and the input box is not empty (newInputValue)
    if (searchFor &&
      searchFor.length >= config.minLength &&
      searchFor !== foundFor &&
      searchFor !== processing &&
      newInputValue!==''
    ) {
      // debugger
      // issue search request using trimmed value
      onSearch(searchFor)
      // set raw value as processing
      setProcessing(searchFor)
    }
  }, [searchFor, foundFor, processing, newInputValue, config.minLength, onSearch])

  // console.group('AsyncAutocompleteSC')
  // console.log('loading...', loading)
  // console.log('options...', options)
  // console.log('newInputValue...', newInputValue)
  // console.log('searchFor...', searchFor)
  // console.log('foundFor...', foundFor)
  // console.log('processing...', processing)
  // console.groupEnd()

  function requestCreate(value: string) {
    // create request is allowed only
    // if the length is sufficient
    // and we are not loading api responses
    // AND onCreate method is provided
    if (value.trim().length >= config.minLength &&
      loading === false && onCreate) {
      // we send trimmed value
      onCreate(value)
      if (config?.reset) {
        // reset selected value to nothing
        setSelected(null)
        setInputValue('')
      }
    }
  }

  function requestAdd(item: AutocompleteOption<T>) {
    // console.log('requestAdd...', item)
    onAdd(item)
    if (config?.reset) {
      // reset selected value to nothing
      setSelected(null)
      setInputValue('')
    }
  }

  /**
   * Value changes of the input text while typing. We pass this
   * value to useDebounce, which returns searchFor value after the timeout.
   */
  function onInputChange(e: any, newInputValue: string, reason: AutocompleteInputChangeReason) {
    // console.group('onInputChange')
    // console.log('newInputValue...', newInputValue)
    // console.log('reason...', reason)
    // console.groupEnd()
    if (e?.key === 'Enter' &&
      newInputValue.length >= config.minLength) {
      // send search request immediately
      onSearch(newInputValue)
      setProcessing(newInputValue)
      // debugger
    } else if (reason !== 'reset') {
      // reset reason occures when option is selected from the list
      // because search text is usually not identical to selected item
      // we ignore onInputChange event when reason==='reset'
      setInputValue(newInputValue)
      // if user removes all input and onClear is provided
      // we trigger on clear event. In addition, in freeSolo
      // the icon is present that activates reason===clear
      if (reason === 'input' && newInputValue === '' && onClear) {
        // console.log('Call on clear event')
        // issue clear attempt
        onClear()
      }
      // we start new search if processing
      // is not empty we should reset it??
      if (processing !== '') {
        setTimeout(() => {
          setProcessing('')
        },0)
      }
    }
    // pass clear event to parent
    // it can be used to cancel api calls
    if (reason === 'clear' && onClear) {
      setInputValue('')
      setProcessing('')
      onClear()
    }
  }

  /**
   * Selection change, occures when user selects an item from the available options (dropdown).
   * NOTE! the input value will also be updated and onInputChange event will occure too.
   */
  function onAutocompleteChange(e: SyntheticEvent,
    value: string | AutocompleteOption<T> | null,
    reason: AutocompleteChangeReason) {
    // console.group('onAutocompleteChange.AsyncAutocompleteSC')
    // console.log('value...', value)
    // console.log('reason...', reason)
    // console.log('reset...', config?.reset)
    if (reason === 'selectOption' &&
      typeof value != 'string' &&
      value !== null) {
      if (value?.input) {
        // request creating
        requestCreate(value?.input)
      } else if (value?.key) {
        //
        requestAdd(value)
      }
    } else if (reason === 'createOption' &&
      typeof value === 'string') {
      // request creating
      requestCreate(value)
      // stop propagation of Enter key to save?
      e.stopPropagation()
    }
    // console.groupEnd()
  }

  // dynamic no options messaging
  // NOTE! it is not used when freeSolo === true
  function noOptionsMessage() {
    // console.log('noOptionsMessage')
    if (!newInputValue ||
      newInputValue.length === 0
    ) {
      return config?.noOptions?.empty ?? 'Type something'
    } else if (newInputValue.length < config.minLength) {
      return config?.noOptions?.minLength ?? 'Keep typing ...'
    } else if (searchFor && searchFor === foundFor) {
      return config?.noOptions?.notFound ?? 'No options'
    } else {
      // in all other situation when no options
      // we show a loading message
      return config?.noOptions?.loading ?? 'Loading...'
    }
  }

  return (
    <>
      <Autocomplete
        freeSolo={config.freeSolo}
        id="async-autocomplete"
        sx={{
          flex:1
        }}
        open={open}
        onOpen={() => {
          setOpen(true)
        }}
        onClose={() => {
          setOpen(false)
        }}
        clearText={config?.clearText}
        noOptionsText={noOptionsMessage()}
        // use to control/reset value
        value={selected}
        defaultValue={defaultValue}
        inputValue={newInputValue}
        filterOptions={(options: AutocompleteOption<T>[],
          state: FilterOptionsState<AutocompleteOption<T>>) => {
          // current input value
          const {inputValue} = state
          // console.group('filterOptions.AsyncAutocomplete')
          // console.log('loading...', loading)
          // console.log('options...', options)
          // console.log('inputValue...', inputValue)
          // console.log('searchFor...', searchFor)
          // console.log('foundFor...', foundFor)
          // check if newInputValue is in the options
          const inputInOptions = options.some(option => option.label.trim().toLowerCase() === inputValue.trim().toLowerCase())
          // console.log('inputInOptions...', inputInOptions)
          // console.groupEnd()
          if (loading === false &&
            inputValue === foundFor &&
            (inputInOptions === false || config.forceShowAdd === true) &&
            config.freeSolo === true
          ) {
            // if we are not loading from api,
            // and the input value is equal to last seach (foundFor)
            // and the value is not found in the options...
            // we add option at the top of the options
            const newOptions = [
              {
                key: '__add_item__',
                label: inputValue,
                data: {} as T,
                input: inputValue
              },
              ...options
            ]
            return newOptions
          } else {
            // return all options
            // already filtered by api
            return options
          }
        }}
        isOptionEqualToValue={(option, value) => option.key === value.key}
        getOptionLabel={(option) => typeof option === 'string' ? option : option?.label}
        onInputChange={onInputChange}
        onChange={onAutocompleteChange}
        options={options}
        // we use loading icon in text field
        renderInput={(params) => (
          <TextField
            {...params}
            variant={config?.variant ?? 'outlined'}
            label={config.label}
            helperText={config.help}
            error={config?.error ? config.error : false}
            onKeyDown={(e) => {
              // console.log('onKeyDown.TextField.AsyncAutocompleteSC')
              // disable enter key when autocomplete menu options closed
              // it seem to crash component in some configuration (probably when freeSolo===false)
              if (e.key === 'Enter' && open === false) {
                // stop propagation
                e.stopPropagation()
              }
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                'aria-label': config.label ?? 'Search',
                endAdornment: (
                  <>
                    {loading ? <CircularProgress data-testid="circular-loader" color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }
            }}
          />
        )}
        renderOption={onRenderOption}
      />
    </>
  )
}
