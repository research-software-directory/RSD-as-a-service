import {HTMLAttributes, SyntheticEvent, useEffect, useState} from 'react'
import {Autocomplete, Button, CircularProgress, TextField} from '@mui/material'
import {Contributor, SearchContributor} from '../../../types/Contributor'
import {useDebounceWithAutocomplete} from '../../../utils/useDebouce'
import {searchForContributor} from '../../../utils/editContributors'
import {AutocompleteOption} from '../../../types/AutocompleteOptions'
import FindContributorItem from './FindContributorItem'
import {splitName} from '../../../utils/getDisplayName'
import {contributorInformation as config} from './editSoftwareConfig'

export type Name = {
  given_names: string
  family_names?: string
}

export default function FindContributor({onAdd, onCreate}:
  { onAdd: (item: Contributor) => void, onCreate:(name:Name)=>void}) {
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
      // exit on abort
      if (abort) return
      // set options
      setOptions(resp ?? [])
      // clean selected option
      setSelected(undefined)
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
    const name = splitName(newInputValue)
    onCreate(name)
    // reset value
    // setInputValue('')
  }

  function addContributor() {
    if (selected && selected.data) {
      onAdd({
        ...selected.data,
        is_contact_person: false,
        software: ''
      })
      // reset values
      // setSelected(undefined)
      // setInputValue('')
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
      // console.group('renderActionButton')
      // console.log('selected...', selected)
      // console.log('newInputValue...', newInputValue)
      // console.groupEnd()
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
  function onAutocompleteChange(e: SyntheticEvent, value: string | AutocompleteOption<SearchContributor> | null) {
    if (typeof value == 'string') {
      // freeSolo - new contributor
      // console.log('onAutocompleteChange...freeSolo...', value)
      // we clean selected option
      setSelected(undefined)
    } else if (value === null) {
      // cleaned
      // console.log('onAutocompleteChange...cleaned...', value)
      // we clean selected option
      setSelected(undefined)
    } else if (value && value?.key) {
      // existing contributor
      // console.log('onAutocompleteChange...option...', value)
      setSelected(value)
    }
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchContributor>,
    state: object) {
    return (
      <li {...props} key={option.key}>
        <FindContributorItem option={option} />
      </li>
    )
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
        // used to reset value
        // value={newInputValue}
        inputValue={newInputValue}
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
            label={config.findContributor.label}
            helperText={config.findContributor.help}
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
        renderOption={renderOption}
      />
      {renderActionButton()}
    </section>
  )
}
