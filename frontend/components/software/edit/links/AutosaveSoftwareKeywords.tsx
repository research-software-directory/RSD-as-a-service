// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Chip from '@mui/material/Chip'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {
  addKeywordsToSoftware, createOrGetKeyword,
  deleteKeywordFromSoftware, silentKeywordDelete
} from '~/components/keyword/apiEditKeywords'
import {sortOnStrProp} from '~/utils/sortFn'
import {EditSoftwareItem, KeywordForSoftware} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import FindKeyword, {Keyword} from '~/components/keyword/FindKeyword'
import {searchForSoftwareKeyword} from './searchForSoftwareKeyword'
import ImportKeywordsFromDoi from './ImportKeywordsFromDoi'
import {config} from './config'


export default function AutosaveSoftwareKeywords(){
  const {token} = useSession()
  const {showErrorMessage, showInfoMessage} = useSnackbar()
  const {watch,setValue,formState:{errors}} = useFormContext<EditSoftwareItem>()
  const [id,keywords,concept_doi] = watch(['id','keywords','concept_doi'])
  const validDoi = errors?.concept_doi ? false : true

  // console.group('AutosaveSoftwareKeywords')
  // console.log('concept_doi...', concept_doi)
  // console.log('validDoi...', validDoi)
  // console.groupEnd()

  function setKeywords(items:KeywordForSoftware[]){
    // save keywords in the form context
    setValue('keywords',items,{
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false
    })
  }

  async function onAdd(selected: Keyword) {
    // check if already added
    const find = keywords.filter(item => item.keyword.trim().toLowerCase() === selected.keyword.trim().toLowerCase())
    let resp
    if (find.length === 0) {
      resp = await addKeywordsToSoftware({
        data:{software:id, keyword: selected.id},
        token
      })
      if (resp.status===200){
        const items = [
          ...keywords,
          {
            ...selected,
            software:id
          }
        ].sort((a,b)=>sortOnStrProp(a,b,'keyword'))
        setKeywords(items)
      }else{
        showErrorMessage(`Failed to save keyword. ${resp.message}`)
      }
    }else{
      showInfoMessage(`${selected.keyword.trim()} is already in the list`)
    }
  }

  async function onCreate(selected: string) {
    // check if already exists
    const find = keywords.filter(item => item.keyword.trim().toLowerCase() === selected.trim().toLowerCase())
    if (find.length === 0) {
      // create or get existing keyword
      const resp = await createOrGetKeyword({
        keyword: selected,
        token
      })
      if (resp.status === 201) {
        const keyword = {
          id: resp.message.id,
          keyword: resp.message.value,
          software: id,
          cnt: null
        }
        // add keyword after created
        await onAdd(keyword)
      }else{
        showErrorMessage(`Failed to save keyword. ${resp.message}`)
      }
    }else{
      showInfoMessage(`${selected.trim()} is already in the list`)
    }
  }

  async function onRemove(pos:number) {
    const item = keywords[pos]
    if (item.software && item.id){
      const resp = await deleteKeywordFromSoftware({
        software: item.software,
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
      <EditSectionTitle
        title={config.keywords.title}
        subtitle={config.keywords.subtitle}
      >
        <ImportKeywordsFromDoi
          software_id={id}
          concept_doi={validDoi && concept_doi ? concept_doi : null}
          keywords={keywords}
          onSetKeywords={setKeywords}
        />
      </EditSectionTitle>
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
      <div className="flex flex-wrap py-2">
        {keywords.map((item, pos) => {
          return(
            <div
              key={item.id}
              className="py-1 pr-1"
            >
              <Chip
                data-testid="keyword-chip"
                title={item.keyword}
                label={item.keyword}
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
