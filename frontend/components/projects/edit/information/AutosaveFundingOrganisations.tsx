// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Chip from '@mui/material/Chip'
import {useState} from 'react'

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {EditOrganisation, FundingOrganisation, SearchOrganisation} from '~/types/Organisation'
import {createOrganisation, searchForOrganisation} from '~/utils/editOrganisation'
import {addOrganisationToProject, deleteOrganisationFromProject} from '~/utils/editProject'
import {getSlugFromString} from '~/utils/getSlugFromString'
import FindOrganisation from '../FindOrganisation'
import {projectInformation as config} from './config'

function createNewOrganisation(organisation:SearchOrganisation){
  const newOrganisation: EditOrganisation = {
    id: organisation.id,
    parent: organisation.parent,
    slug: organisation.slug ? organisation.slug : getSlugFromString(organisation.name),
    // funding organisation without primary maintainer
    primary_maintainer: organisation.primary_maintainer,
    name: organisation.name,
    ror_id: organisation.ror_id,
    is_tenant: organisation.is_tenant,
    website: organisation.website,
    // indicates image already present
    logo_id: organisation.logo_id,
    // new image to upload
    logo_b64: null,
    logo_mime_type: null,
    position: null,
    // funding organisation come from ROR
    source: organisation.source
  }
  return newOrganisation
}

type FundingOrganisationProps={
  id:string,
  items: FundingOrganisation[]
}

export default function FundingOrganisations({id,items}:FundingOrganisationProps) {
  const session = useSession()
  const {showErrorMessage,showInfoMessage} = useSnackbar()
  const [organisations,setOrganisations] = useState(items)

  async function onAddOrganisation(selected: SearchOrganisation) {
    // check if already exists
    const find = organisations.filter(item => item.name === selected.name)
    if (find.length === 0) {
      let resp
      let organisation
      if (selected.id===null){
        organisation = createNewOrganisation(selected)
        resp = await createOrganisation({
          item: organisation,
          token: session.token
        })
        // debugger
        if (resp.status == 201) {
          // we receive organisation id
          organisation.id = resp.message
          // and we add organisation to project
          // as funding organisation
          resp = await addOrganisationToProject({
            project: id,
            organisation: resp.message,
            role: 'funding',
            position: null,
            session
          })
        }
      } else {
        organisation = createNewOrganisation(selected)
        resp = await addOrganisationToProject({
          project: id,
          organisation: organisation.id as string,
          role: 'funding',
          position: null,
          session
        })
      }
      if (resp.status===200){
        const items = [
          ...organisations,
          organisation
        ]
        setOrganisations(items)
      }else{
        showErrorMessage(`Failed to add organisation. ${resp.message}`)
      }
    }else{
      showInfoMessage(`${selected.name} is already in the list.`)
    }
  }

  async function onRemoveOgranisation(pos:number) {
    const item = organisations[pos]
    if(item.id){
      const resp = await deleteOrganisationFromProject({
        project: id,
        organisation: item.id,
        role: 'funding',
        token: session.token
      })
      if (resp.status === 200){
        const items=[
          ...organisations.slice(0,pos),
          ...organisations.slice(pos+1)
        ]
        setOrganisations(items)
      }else{
        showErrorMessage(`Failed to delete organisation. ${resp.message}`)
      }
    }
  }

  return (
    <>
      <h3 className="mb-2">{config.funding_organisations.subtitle}</h3>
      <div className="flex flex-wrap py-2">
      {organisations.map((item, pos) => {
        return(
          <div
            key={item.id}
            className="py-1 pr-1"
          >
            <Chip
              title={item.name}
              label={item.name}
              onDelete={() => onRemoveOgranisation(pos)}
            />
          </div>
        )
      })}
      </div>
      <FindOrganisation
        config={{
          freeSolo: false,
          minLength: config.funding_organisations.validation.minLength,
          label: config.funding_organisations.label,
          help: config.funding_organisations.help,
          reset: true,
          noOptions: {
            empty: 'Type organisation name',
            minLength: 'Keep typing, name is too short',
            notFound: 'Nothing found, check spelling'
          }
        }}
        onAdd={onAddOrganisation}
        searchForOrganisation={searchForOrganisation}
        // onCreate={onCreateOrganisation}
      />
    </>
  )
}
