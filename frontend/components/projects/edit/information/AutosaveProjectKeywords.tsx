// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Chip from '@mui/material/Chip'

import {useSession} from '~/auth/AuthProvider'
import {KeywordForProject} from '~/types/Project'
import FindKeyword, {Keyword} from '~/components/keyword/FindKeyword'
import {projectInformation as config} from './config'
import {searchForProjectKeyword} from './searchForKeyword'
import {
  addKeywordsToProject, createOrGetKeyword,
  deleteKeywordFromProject, silentKeywordDelete
} from '~/components/keyword/apiEditKeywords'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'

type ProjectKeywordsProps={
  project_id:string,
  items: KeywordForProject[]
}

export default function AutosaveProjectKeywords({project_id,items}:ProjectKeywordsProps) {
  const {token} = useSession()
  const {showErrorMessage,showInfoMessage} = useSnackbar()
  const [keywords, setKeywords] = useState(items)

  // console.group('ProjectKeywords')
  // console.log('keywords...', keywords)
  // console.groupEnd()

  async function onAdd(selected: Keyword) {
    // check if already exists
    const find = keywords.filter(item => item.keyword.trim().toLowerCase() === selected.keyword.trim().toLowerCase())
    let resp
    if (find.length === 0) {
      resp = await addKeywordsToProject({
        data:[{project:project_id, keyword: selected.id}],
        token
      })
      if (resp.status===200){
        const items = [
          ...keywords,
          {
            ...selected,
            project:project_id
          }
        ].sort((a, b) => sortOnStrProp(a, b, 'keyword'))
        setKeywords(items)
      }else{
        showErrorMessage(`Failed to save keyword. ${resp.message}`)
      }
    }else{
      showInfoMessage(`${selected.keyword} is already in the list`)
    }
  }

  async function onCreate(selected: string) {
    // check if already exists
    const find = keywords.filter(item => item.keyword.trim().toLowerCase() === selected.trim().toLowerCase())
    if (find.length === 0) {
      // create keyword
      const resp = await createOrGetKeyword({
        keyword: selected,
        token
      })
      if (resp.status===201){
        const keyword = {
          id: resp.message.id,
          keyword: resp.message.value,
          project: project_id,
          cnt: null
        }
        // add keyword after created
        onAdd(keyword)
      }else{
        showErrorMessage(`Failed to save keyword. ${resp.message}`)
      }
    }else{
      showInfoMessage(`${selected} is already in the list`)
    }
  }

  async function onRemove(pos:number) {
    const item = keywords[pos]
    if (item.project && item.id){
      const resp = await deleteKeywordFromProject({
        project: item.project,
        keyword: item.id,
        token
      })
      if (resp.status===200){
        const items=[
          ...keywords.slice(0,pos),
          ...keywords.slice(pos+1)
        ]
        setKeywords(items)
        // try to delete this keyword from keyword table
        // delete will fail if the keyword is referenced
        // therefore we do not check the status
        silentKeywordDelete({
          keyword: item.keyword,
          token
        })
      }else{
        showErrorMessage(`Failed to delete keyword. ${resp.message}`)
      }
    }
  }

  return (
    <>
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
      <div className="flex flex-wrap py-2">
        {keywords.map((field, pos) => {
          return(
            <div
              key={field.id}
              className="py-1 pr-1"
            >
              <Chip
                data-testid="keyword-chip"
                title={field.keyword}
                label={field.keyword}
                onDelete={() => onRemove(pos)}
                sx={{
                  textTransform:'capitalize'
                }}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}
