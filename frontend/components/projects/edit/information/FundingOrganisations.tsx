// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Chip from '@mui/material/Chip'
import {useFieldArray, useFormContext} from 'react-hook-form'

import {SearchOrganisation} from '~/types/Organisation'
import {EditProject} from '~/types/Project'
import {searchForOrganisation} from '~/utils/editOrganisation'
import FindOrganisation from '../FindOrganisation'
import {projectInformation as config} from './config'

export default function FundingOrganisations() {
  const {control} = useFormContext<EditProject>()
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'funding_organisations',
    // change internal key name from id to fid
    // to avoid conflict with id prop in data
    keyName: 'fid'
  })

  function onAddOrganisation(selected: SearchOrganisation) {
    // check if already exists
    const find = fields.filter(item => item.name === selected.name)
    if (find.length === 0) {
      append({
        ...selected,
        // add position for update
        pos: fields.length
      })
    }
  }

  function onRemoveOgranisation(pos:number) {
    remove(pos)
  }

  return (
    <>
      <h3 className="mb-2">{config.funding_organisations.subtitle}</h3>
      <div className="flex flex-wrap py-2">
      {fields.map((field, pos) => {
        return(
          <div
            key={field.fid}
            className="py-1 pr-1"
          >
            <Chip
              title={field.name}
              label={field.name}
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
