// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ContentLoader from '~/components/layout/ContentLoader'
import useSoftwareContext from '~/components/software/edit/context/useSoftwareContext'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import config from './config'
import {useSoftwareCommunities} from './useSoftwareCommunities'
import FindCommunity from './FindCommunity'
import SoftwareCommunityList from './SoftwareCommunityList'
import SoftwareCommunitiesInfo from './SoftwareCommunitiesInfo'
import CommunityCategoriesDialog from './CommunityCategoriesDialog'

type ModalProps={
  delete:{
    open: boolean,
    id?: string|null
    name?: string | null
  },
  categories:{
    open:boolean,
    community?: CommunityListProps
    edit?:boolean
  }
}

export default function EditSoftwareCommunities() {
  const {software} = useSoftwareContext()
  const {loading,communities,joinCommunity,leaveCommunity} = useSoftwareCommunities(software.id)
  const [modal,setModal] = useState<ModalProps>({
    delete:{
      open:false
    },
    categories:{
      open:false
    }
  })

  if (loading) return (
    <ContentLoader />
  )

  function onDeleteCommunity(id:string){
    const com = communities.find(item=>item.id===id)
    if (com){
      setModal({
        delete:{
          open: true,
          id: com.id,
          name: com.name
        },
        categories:{
          open:false
        }
      })
    }
  }

  function onAddCommunity(community: CommunityListProps){
    setModal({
      categories:{
        open: true,
        edit: false,
        community
      },
      delete:{open:false}
    })
  }

  function onOpenEditCategories(community: CommunityListProps) {
    setModal({
      categories:{
        open: true,
        edit: true,
        community
      },
      delete:{open:false}
    })
  }

  function closeModals(){
    setModal({
      categories:{open:false},
      delete: {open:false},
    })
  }

  return (
    <>
      <EditSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
        <section className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>{config.title}</span>
            <span>{communities?.length ?? 0}</span>
          </h2>
          <SoftwareCommunityList
            communities={communities}
            onDelete={onDeleteCommunity}
            onEdit={onOpenEditCategories}
          />
        </section>
        <section className="py-4">
          <EditSectionTitle
            title={config.findCommunity.title}
            subtitle={config.findCommunity.subtitle}
          />
          <FindCommunity
            onAdd={onAddCommunity}
          />

          <SoftwareCommunitiesInfo />

        </section>
      </EditSection>
      {modal.delete.open ?
        <ConfirmDeleteModal
          title="Remove community"
          open={modal.delete.open}
          body={
            <p>Are you sure you want to remove <strong>{modal.delete.name ?? ''}</strong>? This will also delete all related (if any) categories.</p>
          }
          onCancel={closeModals}
          onDelete={()=>{
            // only if id present
            if(modal.delete.id) {
              leaveCommunity({
                software: software.id,
                community: modal.delete.id
              })
            }
            // we close modal anyway
            closeModals()
          }}
        />
        : null
      }
      {modal.categories.open && modal.categories.community ?
        <CommunityCategoriesDialog
          softwareId={software.id}
          community={modal.categories.community}
          edit = {modal.categories.edit ?? false}
          onCancel={closeModals}
          onComplete={()=>{
            // if new community we also need to join
            if (modal.categories.community && modal.categories.edit===false){
              joinCommunity({
                software: software.id,
                community: modal.categories.community
              })
            }
            closeModals()
          }}
        />
        :null
      }
    </>
  )
}
