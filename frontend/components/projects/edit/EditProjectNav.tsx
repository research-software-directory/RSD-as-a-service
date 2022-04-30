
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {editProjectSteps} from './editProjectSteps'
import useProjectContext from './useProjectContext'

export default function EditProjectNav() {
  const {step,setEditStep} = useProjectContext()
  return (
    <nav>
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editProjectSteps.map((item, pos) => {
          return (
            <ListItemButton
              key={`step-${pos}`}
              selected={item.label === step?.label ?? ''}
              onClick={() => {
                setEditStep(editProjectSteps[pos])
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
