import {SyntheticEvent, useEffect, useState} from 'react'
import {Autocomplete, Button, CircularProgress, TextField} from '@mui/material'
import {AutocompleteOption} from '../../form/ControlledAutocomplete'
import {SearchContributor} from '../../../types/Contributor'
import {useDebounceWithAutocomplete} from '../../../utils/useDebouce'
import {searchForContributor} from '../../../utils/editContributors'

export default function AsyncAutocomplete() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<AutocompleteOption<SearchContributor>[]>([])
  const [selected, setSelected] = useState<AutocompleteOption<SearchContributor>>()
  const [loading, setLoading] = useState(false)
  const [newInputValue, setInputValue] = useState('')
  const searchFor = useDebounceWithAutocomplete(newInputValue,selected?.label,500)

  useEffect(() => {
    let abort = false
    const searchContributor = async (searchFor:string) => {
      if (abort) return
      setLoading(true)
      const resp = await searchForContributor({
        searchFor,
        frontend:true
      })
      // debugger
      if (abort) return
      setOptions(resp ?? [])
      setLoading(false)
    }
    // if we have search term at least 3 chars long
    if (searchFor && searchFor.length > 2) {
      searchContributor(searchFor)
    } else if (abort===false) {
      setOptions([])
      setLoading(false)
    }
    return ()=>{abort=true}
  }, [searchFor])

  function createNewContributor() {
    // alert(`Create ${newInputValue} `)
    console.log('createNewContributor...' , newInputValue)
  }

  function addContributor() {
    console.log('addContributor...' , selected)
  }

  function renderActionButton() {
    // debugger
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
      newInputValue?.length > 5) {
      return (
        <Button
          onClick={createNewContributor}
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
    console.log('onInputChange...', newInputValue)
    setInputValue(newInputValue)
  }

  /**
   * Selection change, occures when user selects an item from the available options (dropdown).
   * NOTE! the input value will also be updated and onInputChange event will occure too.
   */
  function onAutocompleteChange(e: SyntheticEvent, value: string | AutocompleteOption<SearchContributor> | null) {
    // debugger
    if (typeof value == 'string') {
      // freeSolo - new contributor
      console.log('onAutocompleteChange...freeSolo...', value)
      // we clean selected option
      setSelected(undefined)
    } else if (value === null) {
      // cleaned
      console.log('onAutocompleteChange...cleaned...', value)
      // we clean selected option
      setSelected(undefined)
    } else if (value && value?.key) {
      // existing contributor
      console.log('onAutocompleteChange...option...', value)
      setSelected(value)
    }
  }

  return (
    <section className="flex items-center">
      <Autocomplete
        freeSolo={true}
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
        isOptionEqualToValue={(option, value) => option.data.display_name === value.data.display_name}
        getOptionLabel={(option) => option.label}
        onInputChange={onInputChange}
        onChange={onAutocompleteChange}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Contributor"
            helperText="Type at least 3 letters of contributor name"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {renderActionButton()}
    </section>
  )
}
