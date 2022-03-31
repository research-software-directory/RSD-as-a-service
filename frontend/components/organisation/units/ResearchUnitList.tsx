/**
 * UnitsList component is adjusted OrganisationsList component
 * from the location (/components/software/organisations/)
 */
import {useRouter} from 'next/router'
import {Alert, AlertTitle} from '@mui/material'
import List from '@mui/material/List'
import {OrganisationForOverview} from '../../../types/Organisation'

import ResearchUnitItem from './ResearchUnitItem'

type UnitsListProps = {
  organisations: OrganisationForOverview[]
  isMaintainer: boolean
  onEdit: (pos: number) => void
  onDelete: (pos: number) => void
}

export default function ResearchUnitsList({organisations,onEdit,onDelete,isMaintainer}:UnitsListProps) {
  const router = useRouter()
  function renderList() {
    return organisations.map((item,pos) => {
      return (
        <ResearchUnitItem
          key={pos}
          pos={pos}
          organisation={item}
          onEdit={onEdit}
          onDelete={onDelete}
          isMaintainer={isMaintainer}
          rsdPath={router.asPath}
        />
      )
    })
  }

  if (organisations.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight: 500}}>The organisation has no research units</AlertTitle>
        {
          isMaintainer ?
          <span>Add one using <strong>ADD button!</strong></span>
          :null
        }
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
