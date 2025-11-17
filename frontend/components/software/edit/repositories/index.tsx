// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import AddButton from '~/components/layout/AddButton'
import ContentLoader from '~/components/layout/ContentLoader'
import useSoftwareContext from '../context/useSoftwareContext'
import SoftwareRepositoriesInfo from './SoftwareRepositoriesInfo'
import SoftwareRepositoryModal from './SoftwareRepositoryModal'
import useRepositoryEdit from './useRepositoryEdit'
import SoftwareRepositoriesList from './SoftwareRepositoriesList'
import {EditRepositoryProps} from './apiRepositories'

type EditRepoModal={
  open:boolean
  item?: EditRepositoryProps
}

export default function SoftwareRepositories() {
  const {software} = useSoftwareContext()
  const {
    loading,newRepo,repositories,
    addRepository,sortRepositories,
    deleteRepository
  } = useRepositoryEdit(software.id)
  // Manage modal state
  const [modal, setModal] = useState<EditRepoModal>({
    open: false
  })

  // console.group('SoftwareRepositories')
  // console.log('software_id...', software.id)
  // console.log('repositories...', repositories)
  // console.groupEnd()

  return (
    <>
      <EditSection className="py-4">
        <EditSectionTitle
          title="Source code repositories"
          subtitle="Where can the source code of this software be found?"
        >
          <AddButton onAdd={()=>{
            let pos = 1
            if (repositories?.length > 0) pos = repositories?.length + 1
            newRepo.position = pos
            setModal({open:true,item:newRepo})
          }}/>
        </EditSectionTitle>
        <div className="flex-1 xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem] items-start">
          <div className="flex-1">
            {loading ?
              <ContentLoader />
              :
              <SoftwareRepositoriesList
                items={repositories}
                onSorted={sortRepositories}
                onDelete={deleteRepository}
              />
            }
          </div>
          <SoftwareRepositoriesInfo />
        </div>
      </EditSection>
      {/* create/edit new repo */}
      {modal?.open ?
        <SoftwareRepositoryModal
          item = {modal.item}
          onCancel={()=>setModal({open:false})}
          onSubmit={(data)=>{
            addRepository({data})
            setModal({open:false})
          }}
        />
        : null
      }
    </>
  )
}
