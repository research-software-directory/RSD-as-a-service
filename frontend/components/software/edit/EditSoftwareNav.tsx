import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editSoftwareMenu, EditSoftwarePage} from '../../../components/software/edit/editSoftwareSteps'

export default function EditSoftwareNav({step, setStep}:
  { step: EditSoftwarePage, setStep: Function }) {
  return (
    <nav>
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editSoftwareMenu.map((item, pos) => {
          return (
            <ListItemButton
              key={`step-${pos}`}
              selected={item.label===step.label}
              onClick={()=>setStep(editSoftwareMenu[pos])}
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
