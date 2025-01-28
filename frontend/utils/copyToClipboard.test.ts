// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import copyToClipboard from './copyToClipboard'

const mockWriteText = jest.fn()

it('return false when no clipboard', async () => {
  const isCopied = await copyToClipboard('test-value')
  // cannot copy in jsodom
  expect(isCopied).toEqual(false)
})

it('copies to clipboard', async () => {
  // mock clipboard
  global.navigator.clipboard = {
    writeText: mockWriteText
  }

  const isCopied = await copyToClipboard('test-value')
  // cannot copy in jsodom
  expect(isCopied).toEqual(true)
  expect(mockWriteText).toHaveBeenCalledTimes(1)
  expect(mockWriteText).toHaveBeenCalledWith('test-value')
})
