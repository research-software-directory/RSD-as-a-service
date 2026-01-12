// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import SortableListItem from '~/components/layout/SortableListItem'
import SortableListItemActions from '~/components/layout/SortableListItemActions'
import {PackageManager, patchPackageManager} from './apiPackageManager'
import PackageManagerItemBody from './PackageManagerItemBody'
import PacManSvcModal from './PacManSvcModal'
import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'

type PackageManagerItemProps = Readonly<{
  item: PackageManager,
  onDelete: () => void
}>

export default function PackageManagerItem({item, onDelete}: PackageManagerItemProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  // manage modal state
  const [modal, setModal] = useState(false)
  const [pacman, setPacman] = useState(item)

  /**
   * Clear service data in repository_url table.
   * Request is placed from service modal.
   * After success we update local repository state.
   * @param param0
   */
  async function clearServiceData({id,data}:{id:string,data:Partial<PackageManager>}){
    const resp = await patchPackageManager({id,data,token})
    if (resp.status===200){
      const updated = {
        ...pacman,
        ...data
      }
      setPacman(updated)
    }else{
      showErrorMessage(`Operation failed: ${resp.message}`)
    }
  }

  return (
    <>
      <SortableListItem
        key={pacman.id}
        item={pacman}
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
        <PackageManagerItemBody item={item} />
      </SortableListItem>
      {modal ?
        <PacManSvcModal
          item={pacman}
          onClose={()=>setModal(false)}
          onClear={clearServiceData}
        />
        : null
      }
    </>
  )
}
