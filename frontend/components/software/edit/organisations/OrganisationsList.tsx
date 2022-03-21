import {Alert, AlertTitle} from '@mui/material'
import List from '@mui/material/List'
import {EditOrganisation} from '../../../../types/Organisation'

import OrganisationsItem from './OrganisationsItem'

type OrganisationListProps = {
  organisations: EditOrganisation[]
  onEdit: (pos: number) => void
  onDelete: (pos: number) => void
}


export default function OrganisationsList({organisations,onEdit,onDelete}:OrganisationListProps) {

  function renderList() {
    return organisations.map((item,pos) => {
      return (
        <OrganisationsItem
          key={pos}
          pos={pos}
          organisation={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )
    })
  }

  if (organisations.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No participating organisations</AlertTitle>
        Add organisation using <strong>search form!</strong>
      </Alert>
    )
  }

  return (
    <List sx={{
      width: '100%',
    }}>
      {renderList()}
    </List>
  )
}
