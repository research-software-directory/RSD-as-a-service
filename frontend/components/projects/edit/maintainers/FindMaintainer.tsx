import {HTMLAttributes, useState} from 'react'

import AsyncAutocomplete from '../../../form/AsyncAutocomplete'
import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import {MaintainerOfProject} from './useProjectMaintainer'
import {maintainers as config} from './config'
import {findMaintainerByName,maintainersToOptions} from './useFindMaintainer'
import {useAuth} from '~/auth'

export type Name = {
  given_names: string
  family_names?: string
}

export default function FindMaintainer({onAdd}:
  { onAdd: (item: MaintainerOfProject) => void }) {
  const {session} = useAuth()
  const [options, setOptions] = useState<AutocompleteOption<MaintainerOfProject>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function onSearch(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const resp = await findMaintainerByName({
      searchFor,
      token: session.token,
      frontend:true
    })
    const options = maintainersToOptions(resp)
    // set options
    setOptions(options)
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function addMaintainer(selected:AutocompleteOption<MaintainerOfProject>) {
    if (selected && selected.data) {
      onAdd(selected.data)
    }
  }

  function onCreate(newInputValue: string) {
    console.log('FindMaintainer.onCreate...NOT SUPPORTED')
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<MaintainerOfProject>,
    state: object) {
    return (
      <li {...props} key={option.key}>
        <div>{option.label}</div>
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocomplete
        status={status}
        options={options}
        onSearch={onSearch}
        onAdd={addMaintainer}
        onCreate={onCreate}
        onRenderOption={renderOption}
        config={{
          freeSolo: false,
          minLength: config.findMaintainer.validation.minLength,
          label: config.findMaintainer.label,
          help: config.findMaintainer.help
        }}
      />
    </section>
  )
}
