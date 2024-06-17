// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import ContentLoader from '~/components/layout/ContentLoader'
import useSoftwareContext from '~/components/software/edit/useSoftwareContext'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import config from './config'
import {useSoftwareCommunities} from './useSoftwareCommunities'
import FindCommunity from './FindCommunity'
import SoftwareCommunityList from './SoftwareCommunityList'
import SoftwareCommunitiesInfo from './SoftwareCommunitiesInfo'

export default function SoftwareCommunities() {
  const {software} = useSoftwareContext()
  const {loading,communities,joinCommunity,leaveCommunity} = useSoftwareCommunities(software.id)
  const [modal, setModal] = useState<{
    open: boolean,
    id: string | null,
    name: string | null
  }>({
    open: false,
    id: null,
    name: null
  })

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )


  function onDeleteCommunity(id:string){
    const com = communities.find(item=>item.id===id)
    if (com){
      setModal({
        open: true,
        id: com.id,
        name: com.name
      })
    }
  }

  function deleteCommunity(id:string){
    // console.log('deleteCommunity...', id)
    leaveCommunity({
      software:software.id,
      community: id
    })
  }

  function onAddCommunity(community:CommunityListProps){
    // console.log('onAddCommunity...', community)
    joinCommunity({
      software:software.id,
      community
    })
  }

  return (
    <>
      <EditSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]">
        <section className="py-4">
          <h2 className="flex pr-4 pb-4 justify-between">
            <span>{config.title}</span>
            <span>{communities?.length ?? 0}</span>
          </h2>
          <SoftwareCommunityList
            communities={communities}
            onDelete={onDeleteCommunity}
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
      {modal.open &&
        <ConfirmDeleteModal
          title="Remove community"
          open={modal.open}
          body={
            <p>Are you sure you want to remove <strong>{modal.name ?? ''}</strong>?</p>
          }
          onCancel={()=>setModal({open:false,id:null,name:null})}
          onDelete={()=>{
            // only if id present
            if(modal.id) {
              deleteCommunity(modal.id)
            }
            // we close modal anyway
            setModal({open:false,id:null,name:null})
          }}
        />
      }
    </>
  )
}
