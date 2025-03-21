// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useContext} from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import Searchbox from '~/components/search/Searchbox'
import Pagination from '~/components/pagination/Pagination'
import PaginationContext from '~/components/pagination/PaginationContext'
import AddCommunityModal, {EditCommunityProps} from './AddCommunityModal'
import CommunityList from './CommunityList'
import {useAdminCommunities} from './useAdminCommunities'

export default function AdminCommunities() {
  const [modal, setModal] = useState(false)
  const {pagination:{page}} = useContext(PaginationContext)
  const {loading, communities, addCommunity, deleteCommunity} = useAdminCommunities()

  async function onAddCommunity(data:EditCommunityProps){
    // add community
    const ok = await addCommunity(data)
    // if all ok close the modal
    // on error snackbar will be shown and we leave modal open for possible corrections
    if (ok===true) setModal(false)
  }

  return (
    <>
      <section className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_1fr] xl:px-0 xl:gap-8">
        <div>
          <div className="flex flex-wrap items-center justify-end">
            <Searchbox />
            <Pagination />
          </div>
          <div className="pt-2">
            <CommunityList
              communities={communities}
              loading={loading}
              page={page}
              onDeleteItem={deleteCommunity}
            />
          </div>
        </div>
        <div className="flex items-start justify-end">
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={()=>setModal(true)}
          >
            Add
          </Button>
        </div>
      </section>
      {
        modal ?
          <AddCommunityModal
            open={modal}
            onCancel={()=>setModal(false)}
            onSubmit={onAddCommunity}
          />
          : null
      }
    </>
  )
}
