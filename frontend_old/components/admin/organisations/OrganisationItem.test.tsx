// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'

import OrganisationItem from './OrganisationItem'
import {OrganisationList} from '~/types/Organisation'

const mockOrganisationItem = {
  id:'test-organisation-id',
  parent: null,
  name: 'Test organisation',
  short_description: null,
  country: null,
  website: 'https://organisation.org',
  is_tenant: true,
  rsd_path: 'test-organistion-path',
  logo_id: null,
  software_cnt: 0,
  project_cnt: 0,
  score: 0
} as OrganisationList

const mockOnDelete = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
})


it('renders organisation item', () => {
  render(
    <OrganisationItem
      item={mockOrganisationItem}
      onDelete = {mockOnDelete}
    />
  )

  // organisation name
  screen.getByText(mockOrganisationItem.name)
  // edit icon button
  screen.getByTestId('EditIcon')
  // delete icon button
  screen.getByTestId('DeleteIcon')
  // screen.debug()
})

it('can DELETE organisation with zero software and projects', () => {
  // ensuren zero counts
  mockOrganisationItem.software_cnt = 0
  mockOrganisationItem.project_cnt=0

  render(
    <OrganisationItem
      item={mockOrganisationItem}
      onDelete = {mockOnDelete}
    />
  )

  // delete icon button
  const deleteBtn = screen.getByRole('button',{name:'delete'})
  fireEvent.click(deleteBtn)

  // check calling
  expect(mockOnDelete).toBeCalledTimes(1)

  // screen.debug(deleteBtn)
})

it('canNOT DELETE organisation with software or projects', () => {
  // ensuren zero counts
  mockOrganisationItem.software_cnt = 1
  mockOrganisationItem.project_cnt = 0

  render(
    <OrganisationItem
      item={mockOrganisationItem}
      onDelete = {mockOnDelete}
    />
  )

  // delete icon button
  const deleteBtn = screen.getByRole('button',{name:'delete'})
  expect(deleteBtn).toBeDisabled()

  // check calling
  fireEvent.click(deleteBtn)
  expect(mockOnDelete).toBeCalledTimes(0)

  // screen.debug(deleteBtn)
})

it('can EDIT organisation with software or projects', () => {
  // ensuren zero counts
  mockOrganisationItem.software_cnt = 1
  mockOrganisationItem.project_cnt = 0

  const editLink=`http://localhost/organisations/${mockOrganisationItem.rsd_path}?tab=settings`

  render(
    <OrganisationItem
      item={mockOrganisationItem}
      onDelete = {mockOnDelete}
    />
  )

  // edit link
  const editBtn = screen.getByRole<HTMLLinkElement>('link',{name:'edit'})
  expect(editBtn.href).toEqual(editLink)
})
