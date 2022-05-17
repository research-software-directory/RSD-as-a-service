import Chip from '@mui/material/Chip'
import {useFieldArray, useFormContext} from 'react-hook-form'

import {EditProject} from '~/types/Project'
import FindKeyword, {Keyword} from '~/components/keyword/FindKeyword'
import {projectInformation as config} from './config'
import {searchForProjectKeyword} from './searchForKeyword'

export default function ProjectKeywords({project}: { project: string }) {
  const {control} = useFormContext<EditProject>()
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'keywords',
    // change internal key name from id to fid
    // to avoid conflict with id prop in data
    keyName: 'fid'
  })

  // console.group('ProjectKeywords')
  // console.log('fields...', fields)
  // console.groupEnd()

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
      <div className="flex flex-wrap py-2">
      {fields.map((field, pos) => {
        return(
          <div
            key={field.fid}
            className="py-1 pr-1"
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
      <FindKeyword
        config={{
          freeSolo: false,
          minLength: config.keywords.validation.minLength,
          label: config.keywords.label,
          help: config.keywords.help,
          reset: true
        }}
        searchForKeyword={searchForProjectKeyword}
        onAdd={onAdd}
        onCreate={onCreate}
      />
    </>
  )
}
