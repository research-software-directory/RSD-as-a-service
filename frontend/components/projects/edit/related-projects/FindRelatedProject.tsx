// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import AsyncAutocompleteSC, {
  AsyncAutocompleteConfig,
  AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'
import {SearchProject} from '~/types/Project'
import {searchForRelatedProjectByTitle} from '~/components/projects/apiProjects'

type FindRelatedProjectProps = {
  // this is project we edit
  project: string,
  token: string,
  config: AsyncAutocompleteConfig
  // searchForKeyword: ({searchFor}:{searchFor:string}) => Promise<Keyword[]>
  onAdd: (item: SearchProject) => void
  onCreate?: (keyword: string) => void
}

export default function FindRelatedProject({project,config,token,onAdd, onCreate}: FindRelatedProjectProps) {
  const [options, setOptions] = useState<AutocompleteOption<SearchProject>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchRelatedProjects(searchFor: string) {
    // console.log('searchKeyword...searchFor...', searchFor)
    // set loading status and clear foundFor
    setStatus({loading: true, foundFor: undefined})
    // make search request
    const resp = await searchForRelatedProjectByTitle({
      project,
      searchFor,
      token
    })
    // console.log('searchKeyword...resp...', resp)
    // convert keywords to autocomplete options
    const options = resp.map(item => ({
      key: item.id,
      label: item.title,
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

  function onAddSelected(selected:AutocompleteOption<SearchProject>) {
    if (selected?.data) {
      onAdd(selected.data)
    }
  }

  function onCreateItem(newInputValue: string) {
    if (onCreate) onCreate(newInputValue)
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchProject>) {
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
    option: AutocompleteOption<SearchProject>
  ) {
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
      <li
        data-testid="related-project-option"
        key={option.key}
        {...props} >
        {/* if new option (has input) show label and count  */}
        {option.label}
      </li>
    )
  }

  return (
    <section
      data-testid="find-related-project"
      className="flex items-center">
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchRelatedProjects}
        onAdd={onAddSelected}
        onCreate={onCreateItem}
        onRenderOption={renderOption}
        config={{
          ...config,
          // freeSolo allows create option
          // if onCreate fn is not provided
          // we do not allow free solo text
          // eg. only selection of found items
          freeSolo: typeof(onCreate) !== 'undefined'
        }}
      />
    </section>
  )
}
