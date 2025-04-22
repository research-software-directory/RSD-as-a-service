// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Box from '@mui/material/Box'
import TableContainer from '@mui/material/TableContainer'

type TableWrapperProps = {
  children: any,
  sx?: any
  nav?: any
}

export default function TableWrapper({children,nav,sx}:TableWrapperProps) {
  return (
    <Box
      component="div"
      sx={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '0.25rem',
        ...sx
      }}
    >
      <TableContainer
        sx={{
          position: 'absolute',
          left: 0, right: 0,
          top: 0, bottom: 0,
          overflow: 'auto'
        }}
      >
        {children}
      </TableContainer>
      {nav}
    </Box>
  )
}
