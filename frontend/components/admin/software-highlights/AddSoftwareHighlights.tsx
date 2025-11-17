// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {HTMLAttributes, useState} from 'react'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {softwareListUrl} from '~/utils/postgrestUrl'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'
import {getSoftwareList} from '~/components/software/apiSoftware'
import AsyncAutocompleteSC, {AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import SoftwareOptionFound from './SoftwareOptionFound'
import {SoftwareHighlight} from './apiSoftwareHighlights'

type AddSoftwareHighlightsProps = {
  highlights: SoftwareHighlight[]
  onAddSoftware: (id:string)=>void
}

export default function AddSoftwareHighlights({onAddSoftware,highlights}:AddSoftwareHighlightsProps) {
  const [options, setOptions] = useState<AutocompleteOption<SoftwareOverviewItemProps>[]>([])
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchSoftware(searchFor: string) {
    setStatus({loading: true, foundFor: undefined})

    const url = softwareListUrl({
      baseUrl: getBaseUrl(),
      search: searchFor,
      order: 'mention_cnt.desc.nullslast,contributor_cnt.desc.nullslast,updated_at.desc.nullslast',
      limit: 50,
      offset: 0,
    })
    // get software list, we do not pass the token
    // when token is passed it will return not published items too
    const resp= await getSoftwareList({url})
    // remove items already in highlights
    const software = itemsNotInReferenceList({
      list: resp.data ?? [],
      referenceList: highlights as any as SoftwareOverviewItemProps[] ?? [],
      key: 'id'
    })

    const options = software.map(item => ({
      key: item.slug,
      label: item.brand_name,
      data: item
    }))
    // set options
    setOptions(options ?? [])
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SoftwareOverviewItemProps>
  ) {
    // when value is not not found option returns input prop
    if (option?.input) {
      // we DO NOT offer an option to create this entry
      return null
    }
    return (
      <li
        data-testid="software-option-found"
        {...props}
        key={option.key}
      >
        <SoftwareOptionFound option={option} />
      </li>
    )
  }

  function onAdd(selected:AutocompleteOption<SoftwareOverviewItemProps>) {
    if (selected?.data) {
      onAddSoftware(selected.data.id)
    }
  }

  return (
    <section className="mb-12">
      <EditSectionTitle
        title="Add software to highlights"
        subtitle="We search by name, short description and keyword"
      />

      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchSoftware}
        onAdd={onAdd}
        // onCreate={onCreateOrganisation}
        onRenderOption={renderOption}
        config={{
          freeSolo: false,
          minLength: 2,
          label: 'Find software',
          help: 'Software already in highlights is EXCLUDED from the list.',
          reset: true
        }}
      />
    </section>
  )
}
