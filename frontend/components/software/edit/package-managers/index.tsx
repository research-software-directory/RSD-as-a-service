// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSection from '~/components/layout/EditSection'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {NewPackageManager, PackageManager} from './apiPackageManager'
import PackageManagersList from './PackageManagersList'
import EditPackageManagerModal from './EditPackageManagerModal'
import useSoftwareContext from '../useSoftwareContext'
import PackageManagersInfo from './PackageManagersInfo'
import usePackageManagers from './usePackageManagers'

type EditPackManModal = {
  open: boolean,
  manager: NewPackageManager | PackageManager
  pos?: number
  edit: boolean
}

export default function PackageManagers() {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const {loading, managers, saveManager,updateManager,sortManagers,deleteManager} = usePackageManagers({
    software: software.id,
    token
  })
  const [modal, setModal] = useState<EditPackManModal>()
  // only admin can edit PM item
  const isAdmin = user?.role === 'rsd_admin'

  // console.group('PackageManagers')
  // console.log('loading...', loading)
  // console.log('software...', software)
  // console.log('managers...', managers)
  // console.log('token...', token)
  // console.groupEnd()

  function getSubtitle() {
    if (managers.length === 0) {
      return software.brand_name
    }
    if (managers.length === 1) {
      return `${software.brand_name} has ${managers.length} download location`
    }
    return `${software.brand_name} has ${managers.length} download locations`
  }

  function onAdd() {
    // create new PM item
    const newPM: NewPackageManager = {
      id: null,
      software: software.id,
      url: '',
      package_manager: null,
      position: managers.length + 1
    }

    setModal({
      open: true,
      manager: newPM,
      edit: false
    })
  }

  async function onEdit(pos:number){
    const item = managers[pos]
    if (item) {
      setModal({
        open: true,
        pos,
        manager: item,
        edit: true
      })
    }
  }

  async function onSorted(newList:PackageManager[]) {
    const resp = await sortManagers(newList)
    if (resp.status !== 200) {
      showErrorMessage(`Failed to sort items. ${resp.message}`)
    }
  }

  async function onDelete(pos: number) {
    const item = managers[pos]
    if (item) {
      const resp = await deleteManager(item.id)
      if (resp.status !== 200) {
        showErrorMessage(`Failed to remove item. ${resp.message}`)
      }
    } else {
      showErrorMessage('Failed to remove item. Internal app error. The item is missing!')
    }
  }

  async function savePackageManager(data: NewPackageManager | PackageManager) {
    let resp
    if (data.id){
      // update if id present
      resp = await updateManager(data as PackageManager)
    }else{
      // create new
      resp = await saveManager(data)
    }
    if (resp.status !== 200) {
      showErrorMessage(`Failed to save ${data.url}. ${resp.message}`)
    } else {
      setModal(undefined)
    }
  }

  return (
    <>
      <EditSection className="py-4">
        <EditSectionTitle
          title="Package managers"
          subtitle={getSubtitle()}
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
              onSorted={onSorted}
              onDelete={onDelete}
              onEdit={isAdmin ? onEdit : undefined}
            />
          </div>
          <PackageManagersInfo />
        </div>
      </EditSection>
      {
        modal &&
        <EditPackageManagerModal
          open={modal.open}
          isAdmin={isAdmin}
          package_manager={modal.manager}
          onCancel={() => {
            setModal(undefined)
          }}
          onSubmit={savePackageManager}
        />
      }
    </>
  )
}
