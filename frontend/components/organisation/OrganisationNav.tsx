import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {organisationMenu} from './OrganisationNavItems'
import {OrganisationForOverview} from '../../types/Organisation'

export default function OrganisationNav({onChangeStep,selected,isMaintainer, organisation}:
  {onChangeStep: Function, selected:string, isMaintainer:boolean, organisation:OrganisationForOverview}) {

  return (
    <nav>
      <List sx={{
        width:'100%'
      }}>
        {organisationMenu.map((item, pos) => {
          if (item.isVisible({
            isMaintainer,
            children_cnt: organisation?.children_cnt
          }) === true) {
            return (
              <ListItemButton
                key={`step-${pos}`}
                selected={item.id === selected}
                onClick={() => {
                  onChangeStep({
                    nextStep: organisationMenu[pos]
                  })
                }}
              >
                <ListItemIcon>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label(organisation)} secondary={item.status} />
              </ListItemButton>
            )
          }
        })}
      </List>
    </nav>
  )
}
