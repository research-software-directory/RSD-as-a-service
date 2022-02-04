import {useContext} from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editSoftwareMenu} from '../../../components/software/edit/editSoftwareSteps'
import editSoftwareContext from './editSoftwareContext'

export default function EditSoftwareNav({onChangeStep}:
  { onChangeStep: Function }) {
  const {pageState} = useContext(editSoftwareContext)

  return (
    <nav>
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editSoftwareMenu.map((item, pos) => {
          return (
            <ListItemButton
              key={`step-${pos}`}
              selected={item.label === pageState?.step?.label ?? ''}
              onClick={() => {
                onChangeStep({
                  nextStep: editSoftwareMenu[pos]
                })
              }}
            >
              <ListItemIcon>
                  {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} secondary={item.status} />
            </ListItemButton>
          )
        })}
      </List>
    </nav>
  )
}
