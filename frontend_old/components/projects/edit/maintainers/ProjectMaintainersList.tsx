// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'
import {useSession} from '~/auth'
import logger from '~/utils/logger'

import ProjectMaintainer from './ProjectMaintainer'
import {MaintainerOfProject} from './useProjectMaintainer'

type ProjectMaintainerListProps = {
  maintainers: MaintainerOfProject[]
  onDelete:(pos:number)=>void
}

export default function ProjectMaintainersList({maintainers,onDelete}:ProjectMaintainerListProps) {
  const {user} = useSession()

  if (maintainers.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No maintainers</AlertTitle>
        Add project mantainer by using <strong>invite link button!</strong>
      </Alert>
    )
  }

  function onEdit(pos:number) {
    logger('onEdit...NOT SUPPORTED FOR MAINTAINERS','info')
  }

  function isDeleteDisabled() {
    // we allow rsd_admin to remove last mantainer too
    if (user?.role === 'rsd_admin' && maintainers?.length > 0) {
      return false
    } else if (maintainers?.length > 1) {
      // common maintainer can remove untill the last mantainer
      return false
    }
    return true
  }

  function renderList() {
    return maintainers.map((item, pos) => {
      return (
        <ProjectMaintainer
          key={pos}
          pos={pos}
          maintainer={item}
          onEdit={onEdit}
          onDelete={onDelete}
          // disable delete when last maintainer
          disableDelete={isDeleteDisabled()}
        />
      )
    })
  }

  return (
    <List sx={{
      width: '100%',
    }}>
      {renderList()}
    </List>
  )
}
