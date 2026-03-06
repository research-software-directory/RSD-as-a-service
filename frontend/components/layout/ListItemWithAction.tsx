// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (NLEsc) <d.mijatovic@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ListItem, {ListItemProps} from '@mui/material/ListItem'
/**
 * ListItemWithAction changes the layout of list component. Instead of having secondaryAction
 * component at absolute position we use it relative element in the flex. This ensures that
 * button area is automatically resized to fix action buttons. Default layout is optimized for only 1 button
 */
export default function ListItemWithAction({children,secondaryAction,...otherProps}:ListItemProps) {
  return (
    <ListItem
      sx={{
        paddingLeft:'8px',
        paddingRight: '8px',
        '.MuiListItemSecondaryAction-root':{
          display: 'flex',
          position: 'relative',
          right: 'auto',
          transform: 'none',
          top: 'inherit'
        }
      }}
      secondaryAction={secondaryAction}
      {...otherProps}
    >
      {children}
    </ListItem>
  )
}
