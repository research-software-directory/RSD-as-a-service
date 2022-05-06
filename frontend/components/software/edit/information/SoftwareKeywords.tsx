import {Control, useFieldArray} from 'react-hook-form'

import Chip from '@mui/material/Chip'

import FindKeyword, {Keyword} from '~/components/keyword/FindKeyword'
import {softwareInformation as config} from '../editSoftwareConfig'
import {searchForSoftwareKeyword} from './searchForSoftwareKeyword'
import {EditSoftwareItem} from '~/types/SoftwareTypes'

export default function SoftwareKeywords({software,control}: {software: string,control:Control<EditSoftwareItem,any>}) {
  const {fields, append, remove} = useFieldArray({
    control,
    name:'keywords'
  })

  function onAdd(selected: Keyword) {
    // check if already added
    const find = fields.filter(item => item.keyword === selected.keyword)
    if (find.length === 0) {
      append({
        id: selected.id,
        software,
        keyword: selected.keyword,
        action: 'add'
      })
    }
  }

  function onCreate(selected: string) {
    // check if already added
    const find = fields.filter(item => item.keyword === selected)
    if (find.length === 0) {
      append({
        id: null,
        pos: fields.length,
        software,
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
            key={field.id}
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
        searchForKeyword={searchForSoftwareKeyword}
        onAdd={onAdd}
        onCreate={onCreate}
      />
    </>
  )
}
