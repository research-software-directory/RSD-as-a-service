// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import {useSession} from '~/auth'
import {SaveContributor} from '~/types/Contributor'
import {splitName} from '~/utils/getDisplayName'
import {isOrcid} from '~/utils/getORCID'
import {contributorInformation as config} from '../editSoftwareConfig'
import AsyncAutocompleteSC,{AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import {searchForPerson} from '~/components/person/searchForPerson'
import {AggregatedPerson} from '~/components/person/groupByOrcid'
import AggregatedPersonOption from '~/components/person/AggregatedPersonOption'
import AggregatedContributorModal, {NewRsdContributor} from './AggregatedContributorModal'


type FindContributorProps = {
  software: string,
  position: number,
  onEdit: (Contributor: SaveContributor) => void
  // for submitting "aggregated person"
  onSubmit: ({contributor}: { contributor: SaveContributor }) => void
}

type ModalState = {
  open: boolean,
  contributor?: NewRsdContributor
}


export default function FindContributor({software,position,onEdit,onSubmit}:FindContributorProps) {
  const {token} = useSession()
  const [modal, setModal] = useState<ModalState>()
  const [options, setOptions] = useState<AutocompleteOption<AggregatedPerson>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchContributor(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const resp = await searchForPerson({
      searchFor,
      token
    })
    // set options
    setOptions(resp)
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function onAddPerson(selected:AutocompleteOption<AggregatedPerson>) {
    if (selected && selected.data) {
      const contributor: NewRsdContributor = {
        ...selected.data,
        software,
        is_contact_person: false,
        selected_avatar: null,
        avatar_id: null,
        avatar_b64: null,
        avatar_mime_type: null,
        role: null,
        position
      }
      // debugger
      setModal({
        open: true,
        contributor
      })
    }
  }

  function onAddContributor(contributor: SaveContributor) {
    // close modal
    setModal({open: false})
    // pass info
    onSubmit({contributor})
  }

  function createContributor(newInputValue: string) {
    const name = splitName(newInputValue)
    // add new contributor
    onEdit({
      id: null,
      software,
      is_contact_person: false,
      email_address: null,
      affiliation: null,
      role: null,
      orcid: null,
      avatar_id: null,
      position,
      ...name
    })
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<AggregatedPerson>) {
    // if more than one option we add border at the bottom
    // we assume that first option is Add "new item"
    if (options.length > 1) {
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
    option: AutocompleteOption<AggregatedPerson>) {
    // console.log('renderOption...', option)
    // when value is not found option returns input prop
    if (option?.input) {
      // add option is NOT available when searching by ORCID
      if (isOrcid(option?.input)===false) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }

    return (
      <li {...props} key={Math.random().toString()}>
        <AggregatedPersonOption option={option} />
      </li>
    )
  }

  return (
    <section className="flex items-center">
      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchContributor}
        onAdd={onAddPerson}
        onCreate={createContributor}
        onRenderOption={renderOption}
        config={{
          freeSolo: true,
          forceShowAdd: true,
          minLength: config.findContributor.validation.minLength,
          label: config.findContributor.label,
          help: config.findContributor.help,
          // clear selected item
          reset: true
        }}
      />
      {modal && modal.open && modal.contributor &&
        <AggregatedContributorModal
          open={modal.open}
          contributor={modal.contributor}
          onCancel={() => setModal({open: false})}
          onSubmit={onAddContributor}
        />
      }
    </section>
  )
}
