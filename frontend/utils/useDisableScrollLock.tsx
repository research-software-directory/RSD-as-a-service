// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * Hook to decide if we need to disable scroll lock on pop-over menus.
 * Currently our header required minimum size of 23rem to fit all items:
 * logo, add button, mobile menu and the profile menu. The min-width
 * is defined in /styles/global.css
 * NOTE! when changing this value we need to update global.css too
 * @returns boolean
 */
export default function useDisableScrollLock() {
  const disable = useMediaQuery('(max-width:30rem)')
  return disable
}
