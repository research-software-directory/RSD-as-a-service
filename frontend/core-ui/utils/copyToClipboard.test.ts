// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import copyToClipboard, {canCopyToClipboard} from './copyToClipboard'

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
  expect(mockWriteText).toBeCalledTimes(1)
  expect(mockWriteText).toBeCalledWith('test-value')
})
