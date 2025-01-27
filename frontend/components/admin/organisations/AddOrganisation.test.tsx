// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'

import AddOrganisation from './AddOrganisation'

const mockAutocompleteOptions = [{
  key: 'primary-key-1',
  label: 'Test organisation 1',
  data: {
    id: null,
    slug: 'test-organisation-1',
    parent: null,
    primary_maintainer: null,
    name: 'Test organisation 1',
    ror_id: 'TEST_ROR_ID',
    is_tenant: false,
    website: 'https://test-site.org',
    logo_id: null,
    source: 'ROR',
    description: null
  }
}]

const mockOnAddOrganisation = jest.fn()
const mockFindInROR = jest.fn()

jest.mock('~/utils/getROR',()=>({
  findInROR: (props:any)=>mockFindInROR(props)
}))

beforeEach(() => {
  jest.resetAllMocks()
})

it('renders add organisation combobox', () => {

  render(
    <AddOrganisation
      onAddOrganisationToRsd={mockOnAddOrganisation}
    />
  )

  screen.getByRole('combobox',{name: 'Find or add organisation'})
  // screen.debug()
})

it('calls findROR api on search', async () => {

  const searchFor = 'Test organisation'

  render(
    <AddOrganisation
      onAddOrganisationToRsd={mockOnAddOrganisation}
    />
  )

  const find = screen.getByRole<HTMLInputElement>('combobox', {name: 'Find or add organisation'})
  fireEvent.change(find, {target: {value: searchFor}})
  expect(find.value).toEqual(searchFor)

  await waitFor(() => {
    expect(mockFindInROR).toHaveBeenCalledTimes(1)
    expect(mockFindInROR).toHaveBeenCalledWith({
      'searchFor': searchFor
    })
  })
})


it('offers to add organisation when not found in ROR', async () => {

  const searchFor = 'Test organisation'
  // return nothing found
  mockFindInROR.mockResolvedValueOnce([])

  render(
    <AddOrganisation
      onAddOrganisationToRsd={mockOnAddOrganisation}
    />
  )

  const find = screen.getByRole<HTMLInputElement>('combobox', {name: 'Find or add organisation'})
  fireEvent.change(find, {target: {value: searchFor}})
  expect(find.value).toEqual(searchFor)

  await waitFor(() => {
    expect(mockFindInROR).toHaveBeenCalledTimes(1)
    expect(mockFindInROR).toHaveBeenCalledWith({
      'searchFor': searchFor
    })
  })

  // has one option
  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(1)
  // that contains Add organisation option
  expect(options[0].innerHTML).toContain(`Add "${searchFor}"`)
  // screen.debug(options[0])
})


it('shows option found in ROR', async () => {

  const searchFor = 'Test organisation'
  // return nothing found
  mockFindInROR.mockResolvedValueOnce(mockAutocompleteOptions)

  render(
    <AddOrganisation
      onAddOrganisationToRsd={mockOnAddOrganisation}
    />
  )

  const find = screen.getByRole<HTMLInputElement>('combobox', {name: 'Find or add organisation'})
  fireEvent.change(find, {target: {value: searchFor}})
  expect(find.value).toEqual(searchFor)

  await waitFor(() => {
    expect(mockFindInROR).toHaveBeenCalledTimes(1)
    expect(mockFindInROR).toHaveBeenCalledWith({
      'searchFor': searchFor
    })
  })

  // has one option
  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(2)
  // that contains Add organisation option
  expect(options[1].innerHTML).toContain(mockAutocompleteOptions[0].label)
  // screen.debug(options)
})
