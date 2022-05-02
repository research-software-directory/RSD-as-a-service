import {HTMLAttributes, useState} from 'react'

import AsyncAutocomplete, {AsyncAutocompleteConfig} from '../../../form/AsyncAutocomplete'
import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import {Keyword, searchForKeyword} from './searchForKeyword'

export default function FindKeyword({config, onAdd, onCreate}:
  {config: AsyncAutocompleteConfig, onAdd: (item: Keyword) => void, onCreate?:(keyword:string)=>void}) {
  const [options, setOptions] = useState<AutocompleteOption<Keyword>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchKeyword(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const resp = await searchForKeyword({searchFor})
    // convert keywords to autocomplete options
    const options = resp.map(item => ({
      key: item.keyword,
      label: item.keyword,
      data: item
    }))
    // set options
    setOptions(options)
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function onAddKeyword(selected:AutocompleteOption<Keyword>) {
    if (selected && selected.data) {
      onAdd(selected.data)
    }
  }

  function createKeyword(newInputValue: string) {
    if (onCreate) onCreate(newInputValue)
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<Keyword>,
    state: object) {
    return (
      <li {...props} key={option.key}>
        {option.label} ({option.data.cnt ?? 0})
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocomplete
        status={status}
        options={options}
        onSearch={searchKeyword}
        onAdd={onAddKeyword}
        onCreate={createKeyword}
        onRenderOption={renderOption}
        config={{
          ...config,
          // freeSolo allows create option
          // if onCreate fn is not provided
          // we do not allow free solo text
          // eg. only selection of found items
          freeSolo: onCreate ? true : false
        }}
      />
    </section>
  )
}
