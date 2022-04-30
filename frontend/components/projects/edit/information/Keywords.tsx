import {useFieldArray, useFormContext} from 'react-hook-form'

import {EditProject} from '~/types/Project'
import FindKeyword from './FindKeyword'
import {projectInformation as config} from './config'
import Chip from '@mui/material/Chip'
import {Keyword} from './searchForKeyword'

export default function Keywords({project}: { project: string }) {
  const {control} = useFormContext<EditProject>()
  const {fields, append, remove} = useFieldArray({
    control,
    name:'keywords'
  })

  function onAdd(selected: Keyword) {
    // check if already exists
    const find = fields.filter(item => item.keyword === selected.keyword)
    if (find.length === 0) {
      append({
        id: selected.id,
        project,
        keyword: selected.keyword,
        action: 'add'
      })
    }
  }

  function onCreate(selected: string) {
    // check if already exists
    const find = fields.filter(item => item.keyword === selected)
    if (find.length === 0) {
      append({
        id: null,
        pos: fields.length,
        project,
        keyword: selected,
        action: 'create'
      })
    }
  }

  function onRemove(pos:number) {
    remove(pos)
  }

  return (
    <>
      <div className="flex flex-wrap">
      {fields.map((field, pos) => {
        return(
          <div
            key={field.id}
            className="py-2 pr-2"
          >
            <Chip
              title={field.keyword}
              label={field.keyword}
              onDelete={() => onRemove(pos)}
            />
          </div>
        )
      })}
      </div>
      <div className="py-1"></div>
      <FindKeyword
        config={{
          freeSolo: false,
          minLength: config.keywords.validation.minLength,
          label: config.keywords.label,
          help: config.keywords.help
        }}
        onAdd={onAdd}
        onCreate={onCreate}
      />
    </>
  )
}
