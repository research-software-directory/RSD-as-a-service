// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {useFormContext} from 'react-hook-form'

import {app} from '~/config/app'
import useOnUnsaveChange from '~/utils/useOnUnsavedChange'
import {editSoftwarePage} from '../../../components/software/edit/editSoftwareSteps'
import useSoftwareContext from './useSoftwareContext'

export default function EditSoftwareNav() {
  const {formState:{isDirty,isValid},reset} = useFormContext()
  const {step,setEditStep} = useSoftwareContext()

  // watch for unsaved changes on page reload
  useOnUnsaveChange({
    isDirty,
    isValid,
    warning: app.unsavedChangesMessage
  })

  function onChangeStep(pos: number) {
    const nextStep = editSoftwarePage[pos]
    // ignore click on same step
    if (nextStep.label===step?.label) return
    // if unsaved changes in the form when changing step
    if (isDirty === true) {
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
              key={`step-${pos}`}
              selected={item.label === step?.label ?? ''}
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

