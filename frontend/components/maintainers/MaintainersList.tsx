// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'

import MaintainerItem from './MaintainerItem'
import {MaintainerProps} from './apiMaintainers'


type MaintainerListProps = {
  maintainers: MaintainerProps[]
  onDelete:(pos:number)=>void
}

export default function MaintainersList({maintainers,onDelete}:MaintainerListProps) {

  if (maintainers.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No maintainers</AlertTitle>
        Add maintainer by using <strong>invite link button!</strong>
      </Alert>
    )
  }

  function renderList() {
    return maintainers.map((item, pos) => {
      return (
        <MaintainerItem
          key={item.account ?? pos}
          pos={pos}
          maintainer={item}
          onDelete={onDelete}
          // disable delete for primary maintainer
          disableDelete={item.disableDelete}
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
