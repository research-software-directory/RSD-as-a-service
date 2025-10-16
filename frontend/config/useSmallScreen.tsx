// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * Smallscreen flag used to hide desktop panels and shown mobile panels.
 * The breakpoint is set to 767px
 * */
export default function useSmallScreen() {
  const smallScreen = useMediaQuery('(max-width:767px)')
  return smallScreen
}
