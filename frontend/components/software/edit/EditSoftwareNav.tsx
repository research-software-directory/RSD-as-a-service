// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {useFormContext} from 'react-hook-form'

import {app} from '~/config/app'
import {editSoftwarePage} from '../../../components/software/edit/editSoftwareSteps'
import useSoftwareContext from './useSoftwareContext'

export default function EditSoftwareNav() {
  const {formState:{isDirty,isValid,dirtyFields},reset} = useFormContext()
  const {step,setEditStep} = useSoftwareContext()

  function onChangeStep(pos: number) {
    const nextStep = editSoftwarePage[pos]
    // ignore click on same step
    if (nextStep.label===step?.label) return
    // if unsaved changes in the form when changing step
    // isDirty prop can be incorrect when defaultValue
    // was undefined at form initalization.
    // see https://github.com/react-hook-form/react-hook-form/issues/6105
    // To mitigate this we include dirtyFields object as additional check
    if (isDirty === true && Object.keys(dirtyFields).length > 0) {
      // notify user about unsaved changes
      const leavePage = confirm(app.unsavedChangesMessage)
      // if user is OK to leave section without saving
      if (leavePage === true) {
        // clean form
        reset()
        // change step
        setEditStep(nextStep)
      }
    } else {
      setEditStep(nextStep)
    }
  }

  return (
    <nav>
      <List sx={{
        width:['100%','100%','15rem']
      }}>
        {editSoftwarePage.map((item, pos) => {
          return (
            <ListItemButton
              data-testid="edit-software-nav-item"
              key={`step-${pos}`}
              selected={item.label === step?.label ?? false}
              onClick={() => {
                onChangeStep(pos)
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

