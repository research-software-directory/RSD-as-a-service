// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Chip from '@mui/material/Chip'
import {useFormContext} from 'react-hook-form'

import {useSession} from '~/auth/AuthProvider'
import {createOrGetKeyword, silentKeywordDelete} from '~/components/keyword/apiEditKeywords'
import {sortOnStrProp} from '~/utils/sortFn'
import useSnackbar from '~/components/snackbar/useSnackbar'
import FindKeyword, {Keyword} from '~/components/keyword/FindKeyword'
import {EditCommunityProps} from '~/components/communities/apiCommunities'
import {useCommunityContext} from '~/components/communities/context'
import config from './config'
import {
  KeywordForCommunity,
  addKeywordsToCommunity, deleteKeywordFromCommunity
} from './apiCommunityKeywords'
import {searchForCommunityKeyword} from './searchForCommunityKeyword'

export default function AutosaveCommunityKeywords(){
  const {token} = useSession()
  const {showErrorMessage, showInfoMessage} = useSnackbar()
  const {watch,setValue} = useFormContext<EditCommunityProps>()
  const {updateCommunity} = useCommunityContext()
  const [id,keywords] = watch(['id','keywords'])

  // console.group('AutosaveCommunityKeywords')
  // console.log('id...', id)
  // console.log('keywords...', keywords)
  // console.groupEnd()

  function setKeywords(items:KeywordForCommunity[]){
    // save keywords in the form context
    setValue('keywords',items,{
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false
    })
    // update in the context
    updateCommunity({
      key:'keywords',
      value: items
    })
  }

  async function onAdd(selected: Keyword) {
    // check if already added
    const find = keywords.filter(item => item.keyword.trim().toLowerCase() === selected.keyword.trim().toLowerCase())
    // debugger
    let resp
    if (find.length === 0) {
      resp = await addKeywordsToCommunity({
        data:{
          community:id,
          keyword: selected.id
        },
        token
      })
      if (resp.status===200){
        const items = [
          ...keywords,
          {
            ...selected,
            community:id
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
    // debugger
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
    if (item.community && item.id){
      const resp = await deleteKeywordFromCommunity({
        community: item.community,
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
        // therefore we do not wait or check the status
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
    <div className="py-8">
      <FindKeyword
        config={{
          freeSolo: false,
          minLength: config.keywords.validation.minLength,
          label: config.keywords.label,
          help: config.keywords.help,
          reset: true
        }}
        searchForKeyword={searchForCommunityKeyword}
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
    </div>
  )
}
