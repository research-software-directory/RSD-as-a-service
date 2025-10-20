// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

export type SizeType = {
  w: number|undefined,
  h: number|undefined,
}

// DEFAULT MOCK of useResizeObserver hook
const useResizeObserver=jest.fn((element: HTMLElement | undefined)=>{
  return {
    w: 300,
    h: 150
  }
})

export default useResizeObserver
