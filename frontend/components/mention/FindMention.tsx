import {HTMLAttributes, useState} from 'react'

import AsyncAutocompleteSC, {
  AsyncAutocompleteConfig, AutocompleteOption
} from '~/components/form/AsyncAutocompleteSC'
import {MentionItemProps} from '~/types/Mention'
import {getMentionType} from './config'
import MentionItemBase from './MentionItemBase'

type FindMentionProps = {
  config: AsyncAutocompleteConfig
  searchFn: (title:string) => Promise<MentionItemProps[]>
  onAdd: (item: MentionItemProps) => void
  onCreate?: (keyword: string) => void
}

export default function FindMention({config, onAdd, searchFn, onCreate}: FindMentionProps) {
  const [options, setOptions] = useState<AutocompleteOption<MentionItemProps>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchForItems(searchFor: string) {
    // console.log('searchForItems...searchFor...', searchFor)
    // reset options before new request
    setOptions([])
    // set loading status and clear foundFor
    setStatus({loading: true, foundFor: undefined})
    // make search request
    const resp = await searchFn(searchFor)
    // console.log('searchForItems...resp...', resp)
    const options = resp.map((item,pos) => ({
      key: pos.toString(),
      label: item.title ?? '',
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

  function onAddKeyword(selected:AutocompleteOption<MentionItemProps>) {
    if (selected && selected.data) {
      onAdd(selected.data)
    }
  }

  function createKeyword(newInputValue: string) {
    if (onCreate) onCreate(newInputValue)
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<MentionItemProps>) {
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
    option: AutocompleteOption<MentionItemProps>,
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
        <MentionItemBase
          item={option.data}
          nav={
            // we show source on nav position
            <span className="text-grey-600 pl-4">{option.data.source}</span>
          }
          type={getMentionType(option.data.mention_type, 'singular')}
          role="find"
        />
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchForItems}
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
