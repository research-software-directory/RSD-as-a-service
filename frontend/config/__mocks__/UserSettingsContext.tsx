// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// import {createContext, useContext, useState} from 'react'

import {rowsPerPageOptions} from '../pagination'

export function useUserSettings(){
  return {
    rsd_page_layout: 'masonry',
    rsd_page_rows: rowsPerPageOptions[0],
    setPageLayout: jest.fn(),
    setPageRows: jest.fn()
  }
}

