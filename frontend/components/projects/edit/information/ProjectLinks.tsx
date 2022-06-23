// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext, useFieldArray} from 'react-hook-form'

import {Button} from '@mui/material'

import {EditProject} from '~/types/Project'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ProjectLinkItem from './ProjectLinkItem'
import {projectInformation as config} from './config'

export default function ProjectLinks({project}:{project:string}) {
  const {control,register} = useFormContext<EditProject>()
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'url_for_project',
    // change internal key name from id to fid
    // to avoid conflict with id prop in data
    keyName: 'fid'
  })

  function addLink() {
    append({
      id: null,
      position: fields.length,
      title: null,
      url: null,
      project
    })
  }

  return (
    <>
      <EditSectionTitle
        title={config.url_for_project.sectionTitle}
        subtitle={config.url_for_project.sectionSubtitle}
      >
        <Button
          onClick={addLink}
          sx={{margin:'0rem 0rem 0.5rem 1rem'}}
        >
          Add
        </Button>
      </EditSectionTitle>
      <section>
        {fields.map((field, pos) => {
          return(
            <ProjectLinkItem
              key={field.fid}
              pos={pos}
              register={register}
              control={control}
              remove={remove}
              defaultValue={field}
            />
          )
        })}
      </section>
    </>
  )
}
