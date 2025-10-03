// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AutosaveFundingOrganisations from './AutosaveFundingOrganisations'
import {projectInformation as config} from './config'

// MOCKS
import mockFundingOrganisations from './__mocks__/fundingOrganisations.json'

// MOCK searchForOrganisation api calls
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSearchForOrganisation = jest.fn(props => Promise.resolve([]))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockCreateOrganisation = jest.fn(props => Promise.resolve([] as any))
jest.mock('~/components/organisation/apiEditOrganisation', () => ({
  searchForOrganisation: jest.fn(props => mockSearchForOrganisation(props)),
  createOrganisation: jest.fn(props=>mockCreateOrganisation(props))
}))

const mockAddOrganisationToProject = jest.fn(props => Promise.resolve({status:200,message:props}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteOrganisationFromProject = jest.fn(props => Promise.resolve({status:200,message:[]}))
jest.mock('~/components/projects/edit/apiEditProject', () => ({
  // ...jest.requireActual('~/components/projects/edit/apiEditProject'),
  addOrganisationToProject: jest.fn(props => mockAddOrganisationToProject(props)),
  deleteOrganisationFromProject: jest.fn(props => mockDeleteOrganisationFromProject(props)),
}))

const mockProps = {
  id: 'test-project-id',
  items: mockFundingOrganisations as any
}


beforeEach(() => {
  jest.clearAllMocks()
})

it('renders funding organisations', () => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveFundingOrganisations {...mockProps} />
    </WithAppContext>
  )

  // check first organisation name
  const orgName = screen.getByText(mockFundingOrganisations[0].name)
  expect(orgName).toBeInTheDocument()
  // check organisations count
  const chips = screen.getAllByTestId('funding-organisation-chip')
  expect(chips.length).toEqual(mockFundingOrganisations.length)
})

it('calls searchForOrganisation api with proper search term', async() => {
  const searchFor = 'Test search string'
  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveFundingOrganisations {...mockProps} />
    </WithAppContext>
  )

  const search = screen.getByRole('combobox', {
    name: config.funding_organisations.label
  })

  fireEvent.change(search, {target: {value: searchFor}})

  // screen.debug(search)

  await waitFor(() => {
    expect(mockSearchForOrganisation).toHaveBeenCalledTimes(1)
    expect(mockSearchForOrganisation).toHaveBeenCalledWith({
      'frontend': true,
      searchFor,
    })
  })
})

it('can add funding organisation from rsd', async() => {
  // one already present
  mockProps.items = [mockFundingOrganisations[0]]
  const foundOrgs = mockFundingOrganisations.slice(1)
    .map(item => ({
      key: item.id,
      label: item.name,
      data: {
        ...item
      }
    }))
  const searchFor = 'Test search string'
  // mock response with 2 items
  mockSearchForOrganisation.mockResolvedValueOnce(foundOrgs as any)

  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveFundingOrganisations {...mockProps} />
    </WithAppContext>
  )

  // get searchbox
  const search = screen.getByRole('combobox', {
    name: config.funding_organisations.label
  })
  // type search
  fireEvent.change(search, {target: {value: searchFor}})

  // wait to load options
  await waitForElementToBeRemoved(screen.getByText('Loading...'))

  // validate options
  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(foundOrgs.length)

  // add first option
  fireEvent.click(options[0])

  await waitFor(() => {
    expect(mockAddOrganisationToProject).toHaveBeenCalledTimes(1)
    expect(mockAddOrganisationToProject).toHaveBeenCalledWith({
      'organisation': foundOrgs[0].key,
      'position': null,
      'project': mockProps.id,
      'role': 'funding',
      'token': mockSession.token
    })
  })
})

it('can add funding organisation from ROR', async() => {
  // one already present
  mockProps.items = [mockFundingOrganisations[0]]
  const foundOrgs = mockFundingOrganisations.slice(1)
    .map(item => ({
      key: item.id,
      label: item.name,
      data: {
        ...item,
        // we need to clean id to mimic new organisation
        id: null
      }
    }))
  const searchFor = 'Test search string'
  const expectedId = 'organisation-test-id'
  // mock response with 2 items
  mockSearchForOrganisation.mockResolvedValueOnce(foundOrgs as any)
  mockCreateOrganisation.mockResolvedValueOnce({
    status: 201,
    message: expectedId
  })
  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveFundingOrganisations {...mockProps} />
    </WithAppContext>
  )

  // get searchbox
  const search = screen.getByRole('combobox', {
    name: config.funding_organisations.label
  })
  // type search
  fireEvent.change(search, {target: {value: searchFor}})

  // wait to load options
  await waitForElementToBeRemoved(screen.getByText('Loading...'))

  // validate options
  const options = screen.getAllByRole('option')
  expect(options.length).toEqual(foundOrgs.length)

  // add first option
  fireEvent.click(options[1])

  await waitFor(() => {
    // create new organisation in RSD
    expect(mockCreateOrganisation).toHaveBeenCalledTimes(1)
    expect(mockCreateOrganisation).toHaveBeenCalledWith({
      'organisation': {
        'city': null,
        'country': null,
        'is_tenant': false,
        'logo_id': foundOrgs[1].data.logo_id,
        'name': foundOrgs[1].data.name,
        'parent': null,
        'primary_maintainer': null,
        'ror_id': foundOrgs[1].data.ror_id,
        'ror_types': null,
        'slug': 'vu-university-amsterdam',
        'website': foundOrgs[1].data.website,
        'wikipedia_url': null,
      },
      'token': 'TEST_TOKEN',
    })

    // add as funding organisations to project
    expect(mockAddOrganisationToProject).toHaveBeenCalledTimes(1)
    expect(mockAddOrganisationToProject).toHaveBeenCalledWith({
      'organisation': expectedId,
      'position': null,
      'project': mockProps.id,
      'role': 'funding',
      'token': mockSession.token
    })
  })
})

it('can remove funding organisation', async() => {
  // already present
  mockProps.items = mockFundingOrganisations
  render(
    <WithAppContext options={{session:mockSession}}>
      <AutosaveFundingOrganisations {...mockProps} />
    </WithAppContext>
  )

  // check organisations count
  const chips = screen.getAllByTestId('funding-organisation-chip')
  const deleteBtn = within(chips[0]).getByTestId('CancelIcon')

  fireEvent.click(deleteBtn)

  await waitFor(() => {
    expect(mockDeleteOrganisationFromProject).toHaveBeenCalledTimes(1)
    expect(mockDeleteOrganisationFromProject).toHaveBeenCalledWith({
      'organisation': mockFundingOrganisations[0].id,
      'project': mockProps.id,
      'role': 'funding',
      'token': mockSession.token,
    })

    // check the item is removed
    const remained = screen.getAllByTestId('funding-organisation-chip')
    expect(remained.length).toEqual(mockFundingOrganisations.length-1)
  })

})
