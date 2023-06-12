// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {maxText} from './maxText'

it('returns complete text value < 100', () => {
  const orgText = 'Lorem ipsum dolor sit amet, consectetuer adipiscin'
  const result = maxText({text:orgText})
  expect(result).toEqual(orgText)
})

it('returns shorten text to 30 and ...', () => {
  const orgText = 'Lorem ipsum dolor sit amet, consectetuer adipiscin'
  const result = maxText({text: orgText, maxLen:30})
  expect(result).toEqual(`${orgText.slice(0,30)}...`)
})

it('returns shorten text to 30 without ...', () => {
  const orgText = 'Lorem ipsum dolor sit amet, consectetuer adipiscin'
  const result = maxText({text: orgText, maxLen: 30, dots:false})
  expect(result).toEqual(`${orgText.slice(0, 30)}`)
})
