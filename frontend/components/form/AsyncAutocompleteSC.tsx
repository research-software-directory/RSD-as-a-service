import {useState, ReactNode, HTMLAttributes, SyntheticEvent, useEffect} from 'react'
import Autocomplete, {AutocompleteChangeReason, AutocompleteRenderOptionState} from '@mui/material/Autocomplete'
import {CircularProgress, FilterOptionsState, TextField} from '@mui/material'

import {useDebounceWithAutocomplete} from '~/utils/useDebounce'

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
  minLength: number,
  label: string,
  help: string,
  reset?: boolean,
  // makes help text red on true
  error?: boolean
  noOptions?: {
    empty: string,
    minLength: string,
    notFound: string,
    loading?: string
  }
}

type AsyncAutocompleteProps<T> = {
  status: {
    loading: boolean,
    foundFor: string|undefined,
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
}


export default function AsyncAutocompleteSC<T>({status, options, config,
  onSearch, onAdd, onCreate, onRenderOption, defaultValue}: AsyncAutocompleteProps<T>) {
  const [open, setOpen] = useState(false)
  const [newInputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<AutocompleteOption<T>|null>(null)
  const searchFor = useDebounceWithAutocomplete(newInputValue, selected?.label, 500)
  const {loading,foundFor} = status

  useEffect(() => {
    // if we have search term at least minLength long
    // and we are not searching already (loading)
    // and new search term is different from search we already done
    if (searchFor
      && searchFor.length >= config.minLength
      && loading === false
      && searchFor!== foundFor) {
      // debugger
      // console.log('useEffect...onSearch...', searchFor)
      onSearch(searchFor)
    }
  },[searchFor,foundFor,loading,config.minLength,onSearch])

  function requestCreate(value: string) {
    // create request is allowed only
    // if the length is sufficient
    // and we are not loading api responses
    if (value.length >= config.minLength &&
      loading === false) {
      // console.log('requestCreate...', value)
      if (options.length > 0) {
        // try to find item in the options
        const foundItems = options.filter(item => item.label.toLocaleLowerCase() === value.toLocaleLowerCase())
        if (foundItems.length > 0) {
          // if we found item in available options
          // we use it
          onAdd(foundItems[0])
        } else if (onCreate) {
          // otherwise we create item
          onCreate(value)
        }
      } else if (onCreate) {
        onCreate(value)
      }
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
  function onInputChange(e: any, newInputValue: string) {
    // console.log('onInputChange.AsyncAutocompleteSC')
    if (e?.key === 'Enter') {
      // ignore enter
    } else {
      setInputValue(newInputValue)
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
  function noOptionsMessage() {
    // debugger
    if (loading === true) {
      return config?.noOptions?.loading ?? 'Loading...'
    } else if (!newInputValue ||
      newInputValue.length === 0
    ) {
      return config?.noOptions?.empty ?? 'Type something'
    } else if (newInputValue.length < config.minLength) {
      return config?.noOptions?.minLength ?? 'Keep typing ...'
    } else if (foundFor && loading === false) {
      return config?.noOptions?.notFound ?? 'No options'
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
          // console.log('state...', state)
          // console.log('inputValue...', inputValue)
          // console.log('searchFor...', searchFor)
          // console.log('foundFor...', foundFor)
          // check if newInputValue is in the options
          const inputInOptions = options.some(option => option.label.toLowerCase() === inputValue.toLowerCase())
          // console.log('inputInOptions...', inputInOptions)
          // console.groupEnd()
          if (loading === false &&
            inputValue === foundFor &&
            inputInOptions === false &&
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
        getOptionLabel={(option) => option.label ? option.label : ''}
        onInputChange={onInputChange}
        onChange={onAutocompleteChange}
        // onHighlightChange={onHighlightChange}
        options={options}
        // we use loading icon in text field
        // loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={config.label}
            helperText={config.help}
            error={config?.error ? config.error : false}
            onKeyDown={(e) => {
              // console.log('onKeyDown.TextField.AsyncAutocompleteSC')
              // dissable enter key when autocomplete menu options closed
              // it seem to crash component in some situations
              if (e.key === 'Enter' && open === false) {
                // stop propagation
                e.stopPropagation()
              }
              if (e.key === 'Delete') {
                setInputValue('')
              }
            }}
            InputProps={{
              ...params.InputProps,
              'aria-label': 'Search',
              endAdornment: (
                <>
                  {loading ? <CircularProgress data-testid="circular-loader" color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={onRenderOption}
      />
    </>
  )
}
