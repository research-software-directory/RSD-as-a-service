// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getSlugFromString} from './getSlugFromString'

it('removes special chars & ?%$!/', () => {
  const title = ' Jack & Jill like numbers 1,2,3 and 4 and silly characters ?%.$!/'
  const slug = getSlugFromString(title)
  const expected = 'jack-jill-like-numbers-123-and-4-and-silly-characters'
  expect(slug).toEqual(expected)
})

it('removes accented chars \xe9 \xe0 ...', () => {
  const title = 'Un \xe9l\xe9phant \xe0 l\'or\xe9e du bois'
  const slug = getSlugFromString(title)
  const expected = 'un-elephant-a-loree-du-bois'
  expect(slug).toEqual(expected)
})

it('supports different separator, like _', () => {
  const title = ' Jack & Jill like numbers 1,2,3 and 4 and silly characters ?%.$!/'
  const slug = getSlugFromString(title,'_')
  const expected = 'jack_jill_like_numbers_123_and_4_and_silly_characters'
  expect(slug).toEqual(expected)
})

it('works with one word', () => {
  const title = 'testing'
  const slug = getSlugFromString(title, '_')
  const expected = 'testing'
  expect(slug).toEqual(expected)
})

it('removes separator char too', () => {
  const title = 'jack_jill'
  const slug = getSlugFromString(title, '_')
  const expected = 'jackjill'
  expect(slug).toEqual(expected)
})

it('returns null string on missing title', () => {
  const title = null
  const slug = getSlugFromString(title as any, '_')
  const expected = ''
  expect(slug).toEqual(expected)
})

it('allows use of capital letters', () => {
  const title = 'This Uses Capitals'
  const slug = getSlugFromString(title, '-',false)
  const expected = 'This-Uses-Capitals'
  expect(slug).toEqual(expected)
})

it('trims original value', () => {
  const title = ' This Uses Capitals '
  const slug = getSlugFromString(title, '-',false)
  const expected = 'This-Uses-Capitals'
  expect(slug).toEqual(expected)
})


