// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

/**
 * DEFAULT MOCKS NEED to be imported before "real" imports
 * DEFAULT MOCKS should return jest.fn() with default results
 * THIS MAKES possible to overwrite default mock with import (after mock import)
 */
// MOCK getUserSettings
jest.mock('~/components/user/ssrUserSettings')
// MOCK getActiveModuleNames
jest.mock('~/config/getSettingsServerSide')
// MOCK isOrganisationMaintainer
jest.mock('~/auth/permissions/isMaintainerOfOrganisation')
// MOCK getOrganisationIdForSlug,getProjectsForOrganisation
jest.mock('~/components/organisation/apiOrganisations')

import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import ResearchUnits from './index'
import config from '../settings/general/generalSettingsConfig'
import mockOrganisation from '../__mocks__/mockOrganisation'
import mockUnits from './__mocks__/mockUnits.json'
import {mockResolvedValueOnce} from '~/utils/jest/mockFetch'
import {getOrganisationChildren} from '~/components/organisation/apiOrganisations'
const mockOrganisationChildren = getOrganisationChildren as jest.Mock

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

describe('frontend/components/organisation/software/index.tsx', () => {
  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })

  it('shows no units message', async() => {
    const ResolvedPage = await ResearchUnits({slug:['test-project']})
    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const noUnitsMsg = screen.getByText('The organisation has no research units')
    expect(noUnitsMsg).toBeInTheDocument()
  })

  it('shows ADD button if primary maintainer', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = mockSession.user?.account

    const ResolvedPage = await ResearchUnits({slug:['test-project']})
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const addBtn = screen.getByRole('button', {name: 'Add'})
    expect(addBtn).toBeInTheDocument()
  })

  it('shows ADD button if role rsd_admin', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = null
    if (mockSession.user) {
      mockSession.user.role='rsd_admin'
    }

    const ResolvedPage = await ResearchUnits({slug:['test-project']})
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

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

    const ResolvedPage = await ResearchUnits({slug:['test-project']})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

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
    // return list of mocked units
    mockOrganisationChildren.mockResolvedValueOnce(mockUnits)

    const ResolvedPage = await ResearchUnits({slug:['test-project']})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const units = screen.getAllByTestId('research-unit-item')
    expect(units.length).toEqual(mockUnits.length)
  })

  it('primary maintainer sees edit research unit button', async () => {
    // set mocked user as primary maintainer
    mockOrganisation.primary_maintainer = mockSession.user?.account
    if (mockSession.user) {
      mockSession.user.role='rsd_user'
    }

    // return list of mocked units
    mockOrganisationChildren.mockResolvedValueOnce(mockUnits)

    const ResolvedPage = await ResearchUnits({slug:['test-project']})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

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

    // return list of mocked units
    mockOrganisationChildren.mockResolvedValueOnce(mockUnits)

    const ResolvedPage = await ResearchUnits({slug:['test-project']})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

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
    // mock inputData
    const mockInputs = {
      name: 'Test unit name',
      website: 'https://google.com/test'
    }

    const ResolvedPage = await ResearchUnits({slug:['test-project']})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

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
        // mock get fn to return new ID in the header - required by createOrganisation
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
      'body': '{"parent":"91c2ffa7-bce6-4488-be00-6613a2d99f51","primary_maintainer":"121212121212","slug":"test-unit-name","name":"Test unit name","ror_id":null,"website":"https://google.com/test","is_tenant":false,"country":null,"city":null,"wikipedia_url":null,"ror_types":null,"logo_id":null}',
      'headers': {
        'Authorization': 'Bearer TEST_TOKEN',
        'Content-Type': 'application/json',
        'Prefer': 'return=headers-only'
      },
      'method': 'POST'
    }
    await waitFor(() => {
      // TODO! fix number of calls
      // expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl,expectedPayload)
    })
  })
})
