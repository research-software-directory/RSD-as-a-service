import {HTMLAttributes, useState} from 'react'

import AsyncAutocompleteSC, {AsyncAutocompleteConfig, AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'

export type Keyword = {
  id: string,
  keyword: string,
  cnt: number | null
}

type FindKeywordProps = {
  config: AsyncAutocompleteConfig
  searchForKeyword: ({searchFor}: {searchFor: string}) => Promise<Keyword[]>
  onAdd: (item: Keyword) => void
  onCreate?: (keyword: string) => void
}

export default function FindKeyword({config, onAdd, searchForKeyword, onCreate}: FindKeywordProps) {
  const [options, setOptions] = useState<AutocompleteOption<Keyword>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchKeyword(searchFor: string) {
    // console.log('searchKeyword...searchFor...', searchFor)
    // set loading status and clear foundFor
    setStatus({loading: true, foundFor: undefined})
    // make search request
    const resp = await searchForKeyword({searchFor})
    // console.log('searchKeyword...resp...', resp)
    // convert keywords to autocomplete options
    const options = resp.map(item => ({
      key: item.keyword,
      label: item.keyword,
      data: item
    }))
    // set options
    setOptions(options)
    // debugger
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

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<Keyword>) {
    // if more than one option we add border at the bottom
    // we assume that first option is Add "new item"
    if (options.length > 1 && onCreate) {
      if (props?.className) {
        props.className+=' mb-2 border-b'
      } else {
        props.className='mb-2 border-b'
      }
    }
    return (
      <li {...props} key={option.key}>
        {/* if new option (has input) show label and count  */}
        <strong>{`Add "${option.label}"`}</strong>
      </li>
    )
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<Keyword>,
    state: object) {
    // console.log('renderOption...', option)
    // when value is not not found option returns input prop
    if (option?.input && onCreate) {
      // if input is over minLength
      if (option?.input.length > config.minLength) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }
    return (
      <li {...props} key={option.key}>
        {/* if new option (has input) show label and count  */}
        {option.label} ({option.data.cnt ?? 0})
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
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
