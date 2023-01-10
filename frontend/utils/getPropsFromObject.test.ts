// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getPropsFromObject} from './getPropsFromObject'

it('returns required props', () => {
  const testObject = {
    prop1: 'prop1',
    prop2: 'prop2',
    prop3: 'prop3'
  }
  const resp = getPropsFromObject(testObject, ['prop1', 'prop3'])
  expect(resp).toEqual({
    prop1: 'prop1',
    prop3: 'prop3',
  })
})

it('returns null when empty string', () => {
  const testObject = {
    prop1: '',
    prop2: 'prop2',
    prop3: 'prop3'
  }
  const resp = getPropsFromObject(testObject, ['prop1'])
  expect(resp).toEqual({
    prop1: null
  })
})

it('returns "" when empty string and useNull==false', () => {
  const testObject = {
    prop1: '',
    prop2: 'prop2',
    prop3: 'prop3'
  }
  const resp = getPropsFromObject(testObject, ['prop1'],false)
  expect(resp).toEqual({
    prop1: ''
  })
})

it('returns null when prop does not exists', () => {
  const testObject = {
    prop1: '',
    prop2: 'prop2',
    prop3: 'prop3'
  }
  const resp = getPropsFromObject(testObject, ['prop4'])
  expect(resp).toEqual({
    prop4: null
  })
})

it('returns undefined when prop does not exists and useNull=false', () => {
  const testObject = {
    prop1: '',
    prop2: 'prop2',
    prop3: 'prop3'
  }
  const resp = getPropsFromObject(testObject, ['prop4'],false)
  expect(resp).toEqual({
    prop4: undefined
  })
})
