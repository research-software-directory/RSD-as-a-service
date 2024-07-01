// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

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
import CommunityAddCategoriesDialog from '~/components/software/edit/communities/CommunityAddCategoriesDialog'
import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import {getCategoryForSoftwareIds} from '~/utils/getSoftware'
import {useSession} from '~/auth'
import {CategoryForSoftwareIds} from '~/types/SoftwareTypes'
import useSnackbar from '~/components/snackbar/useSnackbar'
import logger from '~/utils/logger'

export default function SoftwareCommunities() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
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
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false)
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityListProps | null>(null)
  const [categoriesPerCommunity, setCategoriesPerCommunity] = useState<Map<string, TreeNode<CategoryEntry>[]> | null>(null)
  const [associatedCategoryIds, setAssociatedCategoryIds] = useState<CategoryForSoftwareIds | null>(null)

  const loadAssociatedCategoryIds = useCallback(() => {
    getCategoryForSoftwareIds(software.id, token)
      .then(res => setAssociatedCategoryIds(res))
      .catch(reason => {
        showErrorMessage('Something went wrong while loading the categories belonging to this software')
        logger(reason, 'error')
      })
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [software, token])

  const loadCategoriesPerCommunity = useCallback(() => {
    const map = new Map<string, TreeNode<CategoryEntry>[]>()
    const promises = []
    for (const comm of communities) {
      const promise = loadCategoryRoots(comm.id)
        .then(res => map.set(comm.id, res))
      promises.push(promise)
    }
    Promise.all(promises)
      .then(() => setCategoriesPerCommunity(map))
      .catch((reason) => {
        showErrorMessage('Something went wrong while loading the community categories')
        logger(reason, 'error')
      })

  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [communities])


  useEffect(() => {
    loadAssociatedCategoryIds()
  }, [loadAssociatedCategoryIds])

  useEffect(() => {
    loadCategoriesPerCommunity()
  }, [loadCategoriesPerCommunity])

  // if loading show loader
  if (loading || categoriesPerCommunity === null || associatedCategoryIds === null) return (
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
      .then(loadAssociatedCategoryIds)
  }

  function onAddCommunity(community: CommunityListProps){
    setSelectedCommunity(community)
    setOpenCategoryModal(true)
  }

  function onConfirmAddCommunity() {
    setOpenCategoryModal(false)
    setSelectedCommunity(null)
    joinCommunity({
      software: software.id,
      community: selectedCommunity!
    })
      .then(loadAssociatedCategoryIds)
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
            categoriesPerCommunity={categoriesPerCommunity}
            associatedCategoryIds={associatedCategoryIds}
            onMutation={loadAssociatedCategoryIds}
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
            <p>Are you sure you want to remove <strong>{modal.name ?? ''}</strong>? This will also delete all related (if any) categories.</p>
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
      {openCategoryModal &&
          <CommunityAddCategoriesDialog
            softwareId={software.id}
            community={selectedCommunity!}
            onClose={() => {setOpenCategoryModal(false); setSelectedCommunity(null)}}
            onConfirm={onConfirmAddCommunity}
          />
      }
    </>
  )
}
