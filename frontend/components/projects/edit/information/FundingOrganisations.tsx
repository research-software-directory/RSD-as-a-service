import {useFieldArray, useFormContext} from 'react-hook-form'

import {SearchOrganisation} from '~/types/Organisation'
import {EditProject} from '~/types/Project'
import FindOrganisation from '../FindOrganisation'
import {projectInformation as config} from './config'
import Chip from '@mui/material/Chip'

export default function FundingOrganisations() {
  const {control} = useFormContext<EditProject>()
  const {fields, append, remove} = useFieldArray({
    control,
    name:'funding_organisations'
  })

  function onAddOrganisation(selected: SearchOrganisation) {
    // check if already exists
    const find = fields.filter(item => item.name === selected.name)
    if (find.length === 0) {
      append(selected)
    }
  }

  function onRemoveOgranisation(pos:number) {
    remove(pos)
  }

  return (
    <>
      <h3 className="mb-2">{config.funding_organisations.subtitle}</h3>
      {fields.map((field, pos) => {
        return(
          <div
            key={field.id}
            className="py-2"
          >
            <Chip
              title={field.name}
              label={field.name}
              onDelete={() => onRemoveOgranisation(pos)}
            />
          </div>
        )
      })}
      <div className="py-1"></div>
      <FindOrganisation
        config={{
          freeSolo: false,
          minLength: config.funding_organisations.validation.minLength,
          label: config.funding_organisations.label,
          help: config.funding_organisations.help
        }}
        onAdd={onAddOrganisation}
        // onCreate={onCreateOrganisation}
      />
    </>
  )
}
