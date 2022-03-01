import {HTMLAttributes, useState} from 'react'
import {AutocompleteRenderOptionState} from '@mui/material/Autocomplete'

import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import AsyncAutocomplete from '../../../form/AsyncAutocomplete'
import {MentionItem} from '../../../../types/MentionType'
import {searchForAvailableMentions, mentionsToAutocompleteOptions} from '../../../../utils/editMentions'
import logger from '../../../../utils/logger'
import {mentionInformation as config} from '../editSoftwareConfig'
import FindMentionItem from './FindMentionItem'

export default function FindMention({software,token, onAdd}:
  {software:string,token:string, onAdd: (mention: MentionItem) => void}) {
  const [options, setOptions] = useState<AutocompleteOption<MentionItem>[]>([])
  const [status, setLoading] = useState<{
    loading: boolean,
    foundFor:string|undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchMentions(searchFor: string) {
    // debugger
    setLoading({
      loading: true,
      foundFor: undefined
    })
    // request to api
    const mentions = await searchForAvailableMentions({
      software,searchFor,token
    })
    // prepate mention for autocomplete
    const options = mentionsToAutocompleteOptions(mentions)
    setOptions(options)
    setLoading({
      loading: false,
      foundFor: searchFor
    })
  }

  function addMention(option: AutocompleteOption<MentionItem>) {
    onAdd(option.data)
    // reset options
    if (config.findMention.reset === true) {
      // remove search suggestion after adding
      setOptions([])
    }
  }

  function createMention(title: string) {
    logger('FindMention.createMention...NOT IMPLEMENTED','warn')
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<MentionItem>,
    state: AutocompleteRenderOptionState) {
    return (
      <li {...props} key={option.key}>
        <FindMentionItem
          mention={option.data}
        />
      </li>
    )
  }

  return (
    <section className="flex items-center max-w-[40rem] margin-auto">
      <AsyncAutocomplete
        status={status}
        options={options}
        onSearch={searchMentions}
        onAdd={addMention}
        onCreate={createMention}
        onRenderOption={renderOption}
        config={{
          freeSolo: false,
          minLength: config.findMention.validation.minLength,
          label: config.findMention.label,
          help: config.findMention.help,
          reset: config.findMention.reset
        }}
        defaultValue={undefined}
      />
    </section>
  )
}
