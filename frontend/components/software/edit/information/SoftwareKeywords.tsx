import {useState} from 'react'
import {Control, useFieldArray} from 'react-hook-form'

import Chip from '@mui/material/Chip'

import FindKeyword, {Keyword} from '~/components/keyword/FindKeyword'
import {softwareInformation as config} from '../editSoftwareConfig'
import {searchForSoftwareKeyword, searchForSoftwareKeywordExact} from './searchForSoftwareKeyword'
import {EditSoftwareItem} from '~/types/SoftwareTypes'
import {getKeywordsFromDoi} from '~/utils/getInfoFromDatacite'
import useSnackbar from '~/components/snackbar/useSnackbar'
import GetKeywordsFromDoi from './GetKeywordsFromDoi'


export default function SoftwareKeywords({software, control,concept_doi}:
  { software: string, control: Control<EditSoftwareItem, any>, concept_doi?: string }) {
  const {showErrorMessage,showSuccessMessage,showInfoMessage} = useSnackbar()
  const [loading,setLoading]=useState(false)
  const {fields, append, remove} = useFieldArray({
    control,
    name:'keywords'
  })

  async function onGetKeywordsFromDoi() {
    let added = 0

    setLoading(true)

    const keywordsDoi: string[] = await getKeywordsFromDoi(
      software, concept_doi
    )

    if (keywordsDoi && keywordsDoi.length === 0) {
      showErrorMessage(
        `No Keywords could be found for DOI ${concept_doi}`
      )
      setLoading(false)
      return
    }

    for (const kw of keywordsDoi) {
      if (!kw || kw.length === 0) {
        continue
      }

      const find = fields.filter(item => item.keyword === kw)

      if (find.length > 0) {
        continue
      }

      const findDb = await searchForSoftwareKeywordExact({searchFor: kw})
      let id = null
      let action: 'add' | 'create' = 'create'

      if (findDb.length === 1) {
        id = findDb[0].id
        action = 'add'
      }

      append({
        id: id,
        pos: fields.length,
        software,
        keyword: kw,
        action: action
      })

      added += 1
    }

    if (added > 0) {
      showSuccessMessage(`${added} keywords imported from DOI ${concept_doi}`)
    } else {
      showInfoMessage(`No (additional) keywords to import from DOI ${concept_doi}`)
    }

    setLoading(false)
  }

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
      {
        concept_doi &&
        <div className="pt-4 pb-0">
          <GetKeywordsFromDoi
            onClick={onGetKeywordsFromDoi}
            title={config.importKeywords.message(concept_doi)}
            loading={loading}
          />
        </div>
      }
    </>
  )
}
