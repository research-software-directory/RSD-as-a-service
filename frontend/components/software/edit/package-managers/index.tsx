// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth/AuthProvider'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {NewPackageManager} from './apiPackageManager'
import PackageManagersList from './PackageManagersList'
import useSoftwareContext from '../context/useSoftwareContext'
import PackageManagersInfo from './PackageManagersInfo'
import usePackageManagers from './usePackageManagers'
import PackageManagerModal from './PackageManagerModal'

type PackManModal = {
  open: boolean,
  manager: NewPackageManager
}

export default function EditPackageManagers() {
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const {loading, managers, addManager,sortManagers,deleteManager} = usePackageManagers({
    software: software.id,
    token
  })
  const [modal, setModal] = useState<PackManModal>()

  // console.group('EditPackageManagers')
  // console.log('loading...', loading)
  // console.log('software...', software)
  // console.log('managers...', managers)
  // console.log('token...', token)
  // console.groupEnd()

  function onAdd() {
    // create new PM item
    const newPM: NewPackageManager = {
      id: null,
      software: software.id,
      url: '',
      // package_manager: null,
      position: managers.length + 1
    }

    setModal({
      open: true,
      manager: newPM
    })
  }

  return (
    <>
      <EditSection className="py-4">
        <EditSectionTitle
          title="Package managers"
          subtitle="From which package managers can your software be downloaded?"
        >
          <Button
            variant='contained'
            data-testid="add-package-manager-btn"
            startIcon={<AddIcon />}
            onClick={onAdd}
          >
            Add
          </Button>
        </EditSectionTitle>
        <div className="flex-1 xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem] items-start">
          <div className="flex-1">
            <PackageManagersList
              loading={loading}
              managers={managers}
              onSorted={sortManagers}
              onDelete={deleteManager}
            />
          </div>
          <PackageManagersInfo />
        </div>
      </EditSection>
      {
        modal &&
        <PackageManagerModal
          package_manager={modal.manager}
          onCancel={() => {
            setModal(undefined)
          }}
          onSubmit={(data)=>{
            addManager(data)
            setModal(undefined)
          }}
        />
      }
    </>
  )
}
