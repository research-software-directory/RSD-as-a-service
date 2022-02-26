import {useState, ReactNode, HTMLAttributes, SyntheticEvent, useEffect} from 'react'
import Autocomplete, {AutocompleteRenderOptionState} from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import {CircularProgress, TextField} from '@mui/material'
import {AutocompleteOption} from '../../types/AutocompleteOptions'
import {useDebounceWithAutocomplete} from '../../utils/useDebouce'

type AsyncAutocompleteProps<T> = {
  status: {
    loading: boolean,
    foundFor: string|undefined,
  },
  options: AutocompleteOption<T>[]
  onSearch: (searchFor:string) => void
  onAdd: (option: AutocompleteOption<T>) => void
  onCreate: (inputValue: string) => void
  onRenderOption: (
    props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<T>,
    state: AutocompleteRenderOptionState
  ) => ReactNode
  config: {
    // enables creation of new items
    freeSolo:boolean
    minLength: number,
    label: string,
    help: string
  },
  defaultValue?: AutocompleteOption<T>
}


export default function AsyncAutocomplete<T>({status,options,config,onSearch,onAdd,onCreate,onRenderOption,defaultValue}:AsyncAutocompleteProps<T>) {
  const [open, setOpen] = useState(false)
  const [newInputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<AutocompleteOption<T>>()
  const searchFor = useDebounceWithAutocomplete(newInputValue, selected?.label, 500)
  const {loading,foundFor} = status

  useEffect(() => {
    // if we have search term at least minLength long
    // we are not loading search already
    // and new search term is not equal to search term we already have results
    if (searchFor
      && searchFor.length > config.minLength
      && loading === false
      && searchFor!== foundFor) {
      // debugger
      onSearch(searchFor)
    }
  },[searchFor,foundFor,loading,config.minLength,onSearch])

  // console.group('AsyncAutocomplete')
  // console.log('status...', status)
  // console.log('newInputValue...', newInputValue)
  // console.log('searchFor...', searchFor)
  // console.log('selected...', selected)
  // console.groupEnd()

  function addContributor() {
    if (selected && selected.data) {
      onAdd(selected)
    }
  }

  function renderActionButton() {
    if (selected &&
      selected.label === newInputValue) {
      return (
        <Button
          onClick={addContributor}
          sx={{margin:'0rem 0rem 0.5rem 1rem'}}
        >
          Add
        </Button>
      )
    } else if (typeof selected == 'undefined' &&
      newInputValue?.length > config.minLength &&
      // freeSolo enables creation of custom items
      config.freeSolo===true) {
      return (
        <Button
          onClick={()=>onCreate(newInputValue)}
          sx={{margin:'0rem 0rem 0.5rem 1rem'}}
        >
          Create
        </Button>
      )
    } else {
      return (
        <div className="w-[5rem]"></div>
      )
    }
  }

  /**
   * Value changes of the input text while typing. We pass this
   * value to useDebounce, which returns searchFor value after the timeout.
   */
  function onInputChange(e: SyntheticEvent, newInputValue: string) {
    setInputValue(newInputValue)
  }

  /**
   * Selection change, occures when user selects an item from the available options (dropdown).
   * NOTE! the input value will also be updated and onInputChange event will occure too.
   */
  function onAutocompleteChange(e: SyntheticEvent, value: string | AutocompleteOption<T> | null) {
    if (typeof value == 'string') {
      // freeSolo - new contributor
      // console.log('onAutocompleteChange...freeSolo...', value)
      // we clean selected option
      setSelected(undefined)
    } else if (value === null) {
      // cleaned
      // console.log('onAutocompleteChange...cleaned...', value)
      setSelected(undefined)
    } else if (value && value?.key) {
      // existing contributor
      // console.log('onAutocompleteChange...option...', value)
      setSelected(value)
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
        // used to reset value
        // value={newInputValue}
        defaultValue={defaultValue}
        inputValue={newInputValue}
        isOptionEqualToValue={(option, value) => option.key === value.key}
        getOptionLabel={(option) => option.label}
        onInputChange={onInputChange}
        onChange={onAutocompleteChange}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={config.label}
            helperText={config.help}
            onKeyDown={(e) => {
              // dissable enter key because it crashes
              // the rest of autocomplete process
              if (e.key === 'Enter') {
                e.stopPropagation()
              }
            }}
            InputProps={{
              ...params.InputProps,
              'aria-label': 'Search',
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={onRenderOption}
      />
      {renderActionButton()}
    </>
  )
}
