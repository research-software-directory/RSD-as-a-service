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
    name:'url_for_project'
  })

  // console.group('ProjectLinks')
  // console.log('fields...', fields)
  // console.groupEnd()

  function addLink() {
    append({
      uuid: null,
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
      />
      <section>
        {fields.map((field, pos) => {
          return(
            <ProjectLinkItem
              key={field.id}
              id={field.id}
              pos={pos}
              register={register}
              control={control}
              remove={remove}
              defaultValue={field}
            />
          )
        })}
      </section>
      <div className="flex justify-end py-2">
        <Button
          onClick={addLink}
          sx={{margin:'0rem 0rem 0.5rem 1rem'}}
        >
          Add
        </Button>
      </div>
    </>
  )
}
