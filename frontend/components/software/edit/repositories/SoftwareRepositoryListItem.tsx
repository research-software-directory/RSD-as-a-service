// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import SortableListItem from '~/components/layout/SortableListItem'
import SortableListItemActions from '~/components/layout/SortableListItemActions'
import RepositoryItemContent from './RepositoryItemContent'
import {patchRepositoryUrl, RepositoryForSoftware} from './apiRepositories'
import BackgroundServiceModal from './BackgroundServiceModal'
import {ClearServiceDataProps} from './BackgroundServiceContent'

export type SoftwareRepositoryListItemProps = Readonly<{
  item: RepositoryForSoftware
  onDelete:()=>void
}>
export default function SoftwareRepositoryListItem({item,onDelete}:SoftwareRepositoryListItemProps){
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  // manage modal state
  const [modal, setModal] = useState(false)
  // use local state to update components (item and modal) after successful db update
  const [repository,setRepository] = useState(item)

  /**
   * Clear service data in repository_url table.
   * Request is placed from service modal.
   * After success we update local repository state.
   * @param param0
   */
  async function clearServiceData({id,data}:ClearServiceDataProps){
    const resp = await patchRepositoryUrl({id,data,token})
    if (resp.status===200){
      const updated = {
        ...repository,
        ...data
      }
      setRepository(updated)
    }else{
      showErrorMessage(`Operation failed: ${resp.message}`)
    }
  }

  return (
    <>
      <SortableListItem
        data-testid="software-repository-list-item"
        key={repository.id}
        item={repository}
        secondaryAction={
          <SortableListItemActions
            onService={()=>setModal(true)}
            onDelete={onDelete}
          />
        }
        sx={{
          '&:hover': {
            backgroundColor:'grey.100'
          },
        }}
      >
        <RepositoryItemContent item={repository}/>
      </SortableListItem>

      {modal ?
        <BackgroundServiceModal
          repository = {repository}
          onClose={()=>{
            setModal(false)
          }}
          onClear={clearServiceData}
        />
        : null
      }
    </>
  )
}
