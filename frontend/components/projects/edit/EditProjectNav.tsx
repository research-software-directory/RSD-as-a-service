// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {app} from '~/config/app'
import {editProjectSteps} from './editProjectSteps'
import useProjectContext from './useProjectContext'

export default function EditProjectNav() {
  const {formState:{isDirty,isValid,dirtyFields}} = useFormContext()
  const {step, setEditStep} = useProjectContext()

  function onChangeStep(pos: number) {
    const newStep = editProjectSteps[pos]
    // ignore click on same step
    if (newStep.label===step?.label) return
    // if unsaved changes in the form when changing step
    // isDirty prop can be incorrect when defaultValue
    // was undefined at form initalization.
    // see https://github.com/react-hook-form/react-hook-form/issues/6105
    // To mitigate this we include dirtyFields object as additional check
    if (isDirty === true && Object.keys(dirtyFields).length > 0) {
      // console.group('EditProjectNav')
      // console.log('isDirty...', isDirty)
      // console.log('isValid...', isValid)
      // console.log('dirtyFields...', dirtyFields)
      // console.groupEnd()
      // notify user about unsaved changes
      const leavePage = confirm(app.unsavedChangesMessage)
      // if user is OK to leave section without saving
      if (leavePage === true) {
        // clean form
        // reset()
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
              data-testid="edit-project-nav-item"
              key={`step-${pos}`}
              selected={item.label === step?.label ?? false}
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
