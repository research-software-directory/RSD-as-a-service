// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {HTMLAttributes, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {findInROR} from '~/utils/getROR'
import {newOrganisationProps, searchToEditOrganisation} from '~/components/organisation/apiEditOrganisation'
import {EditOrganisation, SearchOrganisation} from '~/types/Organisation'
import AsyncAutocompleteSC, {AutocompleteOption} from '~/components/form/AsyncAutocompleteSC'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import FindOrganisationItem from '~/components/software/edit/organisations/FindOrganisationItem'
import {organisationInformation as config} from '~/components/software/edit/editSoftwareConfig'
import EditOrganisationModal from '~/components/software/edit/organisations/EditOrganisationModal'
import {ModalProps} from '~/components/software/edit/editSoftwareTypes'

type EditOrganisationModalProps = ModalProps & {
  organisation?: EditOrganisation
}

type AddOrganisationProps = {
  onAddOrganisationToRsd: (organisation: EditOrganisation)=>void
}

export default function AddOrganisation({onAddOrganisationToRsd}:AddOrganisationProps) {
  const {user} = useSession()
  const [options, setOptions] = useState<AutocompleteOption<SearchOrganisation>[]>([])
  const [modal, setModal] = useState<EditOrganisationModalProps>({
    open: false
  })
  const [status, setStatus] = useState<{
    loading: boolean,
    foundFor: string | undefined
  }>({
    loading: false,
    foundFor: undefined
  })

  async function searchOrganisation(searchFor: string) {
    setStatus({loading:true,foundFor:undefined})
    const options = await findInROR({
      searchFor
    })
    // set options
    setOptions(options ?? [])
    // stop loading
    setStatus({
      loading: false,
      foundFor: searchFor
    })
  }

  function onCreateOrganisation(name: string) {
    // create new organisation object
    const newOrganisation: EditOrganisation = newOrganisationProps({
      name,
      // new organisation without primary maintainer
      primary_maintainer: null,
    })
    // show modal
    setModal({
      open: true,
      organisation: newOrganisation
    })
  }

  function onAddOrganisation(selected:AutocompleteOption<SearchOrganisation>) {
    if (selected && selected.data) {
      // convert to edit organisation props
      const addOrganisation: EditOrganisation = searchToEditOrganisation({
        item: selected.data,
        account: user?.account,
      })
      // show modal
      setModal({
        open: true,
        organisation: addOrganisation
      })
    }
  }

  function renderAddOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchOrganisation>) {
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
      <li
        data-testid="add-organisation-option"
        key={option.key}
        {...props}
      >
        {/* if new option (has input) show label and count  */}
        <strong>{`Add "${option.label}"`}</strong>
      </li>
    )
  }

  function renderOption(props: HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption<SearchOrganisation>
  ) {
    // when value is not not found option returns input prop
    if (option?.input) {
      // if input is over minLength
      if (option?.input.length > config.findOrganisation.validation.minLength) {
        // we offer an option to create this entry
        return renderAddOption(props,option)
      } else {
        return null
      }
    }
    return (
      <li
        data-testid="find-organisation-option"
        key={option.key}
        {...props}
      >
        <FindOrganisationItem {...option.data} />
      </li>
    )
  }

  async function saveOrganisation({data}: {data:EditOrganisation}) {
    // pass request to parent
    onAddOrganisationToRsd(data)
    // close modal
    setModal({open: false})
  }

  return (
    <section className="mb-12">
      <EditSectionTitle
        title="Add organisation"
        subtitle="We search organisation in ROR database"
      />

      <AsyncAutocompleteSC
        status={status}
        options={options}
        onSearch={searchOrganisation}
        onAdd={onAddOrganisation}
        onCreate={onCreateOrganisation}
        onRenderOption={renderOption}
        config={{
          freeSolo: true,
          minLength: config.findOrganisation.validation.minLength,
          label: config.findOrganisation.label,
          help: config.findOrganisation.help,
          reset: true
        }}
      />

      {modal.open &&
        <EditOrganisationModal
          open={modal.open}
          pos={modal.pos}
          organisation={modal.organisation}
          onCancel={()=>setModal({open:false})}
          onSubmit={saveOrganisation}
        />
      }
    </section>
  )
}
