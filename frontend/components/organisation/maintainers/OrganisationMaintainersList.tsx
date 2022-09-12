// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'
import logger from '~/utils/logger'

import ProjectMaintainer from '~/components/projects/edit/maintainers/ProjectMaintainer'
import {MaintainerOfOrganisation} from './useOrganisationMaintainers'

type ProjectMaintainerListProps = {
  maintainers: MaintainerOfOrganisation[]
  onDelete:(pos:number)=>void
}

export default function OrganisationMaintainersList({maintainers,onDelete}:ProjectMaintainerListProps) {

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

  function renderList() {
    return maintainers.map((item, pos) => {
      return (
        <ProjectMaintainer
          key={pos}
          pos={pos}
          maintainer={item}
          onEdit={onEdit}
          onDelete={onDelete}
          // disable delete for primary maintainer
          disableDelete={item?.is_primary ?? false}
        />
      )
    })
  }

  // console.log('OrganisationMaintainersList...maintainers...', maintainers)

  return (
    <List sx={{
      width: '100%',
    }}>
      {renderList()}
    </List>
  )
}
