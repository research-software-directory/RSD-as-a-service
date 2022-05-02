import {useFormContext} from 'react-hook-form'

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {app} from '~/config/app'
import useOnUnsaveChange from '~/utils/useOnUnsavedChange'
import {editProjectSteps} from './editProjectSteps'
import useProjectContext from './useProjectContext'

export default function EditProjectNav() {
  const {formState:{isDirty,isValid},reset} = useFormContext()
  const {step, setEditStep} = useProjectContext()

  // watch for unsaved changes on page reload
  useOnUnsaveChange({
    isDirty,
    isValid,
    warning: app.unsavedChangesMessage
  })

  function onChangeStep(pos: number) {
    // if unsaved changes in the form when changing step
    if (isDirty === true) {
      // notify user about unsaved changes
      const leavePage = confirm(app.unsavedChangesMessage)
      // if user is OK to leave section without saving
      if (leavePage === true) {
        // clean form
        reset()
        // change step
        setEditStep(editProjectSteps[pos])
      }
    } else {
      setEditStep(editProjectSteps[pos])
    }
  }

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
              onClick={() => onChangeStep(pos)}
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
