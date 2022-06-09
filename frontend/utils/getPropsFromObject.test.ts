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
