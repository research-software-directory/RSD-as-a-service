// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {splitName} from '~/utils/getDisplayName'

it('returns empty names when name is null or undefined', () => {
  expect(splitName(null!)).toEqual({given_names: '', family_names: ''})
  expect(splitName(undefined!)).toEqual({given_names: '', family_names: ''})
})

it('returns empty names when name is empty or blank', () => {
  expect(splitName(' ')).toEqual({given_names: '', family_names: ''})
  expect(splitName(' ')).toEqual({given_names: '', family_names: ''})
  expect(splitName('   ')).toEqual({given_names: '', family_names: ''})
})

it('returns names correctly when name contains ", "', () => {
  expect(splitName('FamilyName, FirstName')).toEqual({given_names: 'FirstName', family_names: 'FamilyName'})
  expect(splitName(' FamilyName, FirstName ')).toEqual({given_names: 'FirstName', family_names: 'FamilyName'})
  expect(splitName('FamilyName, FirstName0, FirstName1')).toEqual({given_names: 'FirstName0 FirstName1', family_names: 'FamilyName'})
  expect(splitName('FamilyName, FirstName0 FirstName1')).toEqual({given_names: 'FirstName0 FirstName1', family_names: 'FamilyName'})
  expect(splitName('FamilyName0 FamilyName1, FirstName0 FirstName1')).toEqual({given_names: 'FirstName0 FirstName1', family_names: 'FamilyName0 FamilyName1'})
})

it('returns names correctly when name does not contain ", "', () => {
  expect(splitName('FirstName FamilyName')).toEqual({given_names: 'FirstName', family_names: 'FamilyName'})
  expect(splitName(' FirstName FamilyName ')).toEqual({given_names: 'FirstName', family_names: 'FamilyName'})
  expect(splitName('FirstName FamilyName0 FamilyName1')).toEqual({given_names: 'FirstName', family_names: 'FamilyName0 FamilyName1'})
})
