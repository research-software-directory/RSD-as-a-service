import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'

import ProjectMaintainer from './ProjectMaintainer'
import {MaintainerOfProject} from './useProjectMaintainer'

export default function ProjectMaintainersList({maintainers}: { maintainers: MaintainerOfProject[] }) {

  if (maintainers.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No contributors</AlertTitle>
        Add contributors using <strong>search form!</strong>
      </Alert>
    )
  }

  function onEdit(pos:number) {
    console.log('edit maintainer...', pos)
  }

  function onDelete(pos: number) {
    console.log('delete maintainer...', pos)
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
