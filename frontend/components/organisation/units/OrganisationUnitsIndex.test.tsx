// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import ResearchUnits from './index'
import config from '../settings/general/generalSettingsConfig'
import mockOrganisation from '../__mocks__/mockOrganisation'
import mockUnits from './__mocks__/mockUnits.json'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'


const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

// MOCK getOrganisationChildren
const mockGetOrganisationChildren = jest.fn((props) => Promise.resolve([]))
jest.mock('~/components/organisation/apiOrganisations', () => ({
  getOrganisationChildren: jest.fn((props)=>mockGetOrganisationChildren(props))
}))

// MOCK createOrganisation (research unit)
// const mockCreateOrganisation = jest.fn((props)=>Promise.resolve({status:201}))

describe('frontend/components/organisation/software/index.tsx', () => {
  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })

  it('shows no units message', async() => {
    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          <ResearchUnits />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const noUnitsMsg = screen.getByText('The organisation has no research units')
    expect(noUnitsMsg).toBeInTheDocument()
  })

  it('shows ADD button if primary maintainer', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = mockSession.user?.account

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <ResearchUnits />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const addBtn = screen.getByRole('button', {name: 'Add'})
    expect(addBtn).toBeInTheDocument()
  })

  it('shows ADD button if role rsd_admin', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = null
    if (mockSession.user) {
      mockSession.user.role='rsd_admin'
    }

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <ResearchUnits />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const addBtn = screen.getByRole('button', {name: 'Add'})
    expect(addBtn).toBeInTheDocument()
  })

  it('NO ADD button for "common" maintainer', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = null
    mockProps.isMaintainer = true
    if (mockSession.user) {
      mockSession.user.role='rsd_user'
    }

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <ResearchUnits />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const addBtn = screen.queryByRole('button', {name: 'Add'})
    expect(addBtn).not.toBeInTheDocument()
  })

  it('shows organisation units list', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = null
    mockProps.isMaintainer = true
    if (mockSession.user) {
      mockSession.user.role='rsd_user'
    }
    // mock unit response
    mockGetOrganisationChildren.mockResolvedValueOnce(mockUnits as any)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <ResearchUnits />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const units = screen.getAllByTestId('research-unit-item')
    expect(units.length).toEqual(mockUnits.length)
  })

  it('primary maintainer sees edit research unit button', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = mockSession.user?.account
    if (mockSession.user) {
      mockSession.user.role='rsd_user'
    }
    // mock unit response
    mockGetOrganisationChildren.mockResolvedValueOnce(mockUnits as any)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <ResearchUnits />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const units = screen.getAllByTestId('research-unit-item')

    const editBtn = within(units[0]).getByRole('button')
    expect(editBtn).toBeInTheDocument()
  })

  it('rsd_admin sees edit research unit button', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = null
    if (mockSession.user) {
      mockSession.user.role='rsd_admin'
    }
    // mock unit response
    mockGetOrganisationChildren.mockResolvedValueOnce(mockUnits as any)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <ResearchUnits />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const units = screen.getAllByTestId('research-unit-item')

    const editBtn = within(units[0]).getByRole('button')
    expect(editBtn).toBeInTheDocument()
  })

  it('primary maintainer can add research unit', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = mockSession.user?.account
    if (mockSession.user) {
      mockSession.user.role='rsd_user'
    }
    // mock unit response
    mockGetOrganisationChildren.mockResolvedValueOnce(mockUnits as any)
    // mock inputData
    const mockInputs = {
      name: 'Test unit name',
      website: 'https://google.com/test'
    }

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <ResearchUnits />
        </WithOrganisationContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // ADD new unit
    const addBtn = screen.getByRole('button', {name: 'Add'})
    // click on add button
    fireEvent.click(addBtn)

    // get modal
    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()

    // create name
    const nameInput = within(modal).getByRole('textbox', {
      name: config.name.label
    })
    fireEvent.change(nameInput, {target: {value: mockInputs.name}})
    expect(nameInput).toHaveValue(mockInputs.name)

    // create website
    const websiteInput = within(modal).getByRole('textbox', {
      name: config.website.label
    })
    fireEvent.change(websiteInput, {target: {value: mockInputs.website}})

    // validate that slug value is populated
    const slugInput = await within(modal).findByPlaceholderText(config.slug.label)
    // wait input to be updated
    await waitFor(() => {
      expect(slugInput).toHaveValue('test-unit-name')
    })

    // MOCK createOrganisation fetch call
    mockResolvedValueOnce('OK', {
      status: 201,
      headers: {
        // mock get fn to return new id in the header - required by createOrganisation
        get: (prop:string) => {
          if (prop === 'location') return '/organisation?id=eq.ad13eb96-dd3e-4f8b-9b9f-d63ee7a078b8'
          return prop
        }
      }
    })

    // use save button
    const saveBtn = await within(modal).findByRole('button', {
      name: 'Save'
    })
    // wait for save to be enabled
    await waitFor(() => expect(saveBtn).toBeEnabled())
    // click save button
    fireEvent.click(saveBtn)

    // validate api call
    const expectedUrl = '/api/v1/organisation'
    const expectedPayload = {
      'body': '{"parent":"91c2ffa7-bce6-4488-be00-6613a2d99f51","slug":"test-unit-name","primary_maintainer":"121212121212","name":"Test unit name","ror_id":null,"is_tenant":false,"website":"https://google.com/test","logo_id":null}',
      'headers': {
        'Authorization': 'Bearer TEST_TOKEN',
        'Content-Type': 'application/json',
        'Prefer': 'return=headers-only'
      },
      'method': 'POST'
    }
    await waitFor(() => {
      // TODO! fix number of calls
      // expect(global.fetch).toBeCalledTimes(2)
      expect(global.fetch).toBeCalledWith(expectedUrl,expectedPayload)
    })
  })
})
