// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
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
// MOCK getOrganisationIdForSlug
jest.mock('~/components/organisation/apiOrganisations')
// MOCK isOrganisationMaintainer
jest.mock('~/auth/permissions/isMaintainerOfOrganisation')
// MOCK createSession
jest.mock('~/auth/getSessionServerSide')
// mock user agreement call
jest.mock('~/components/user/settings/agreements/useUserAgreements')

import {fireEvent, render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import OrganisationSettings from './index'
import config from './general/generalSettingsConfig'

import mockOrganisation from '../__mocks__/mockOrganisation'
import {createSession} from '~/auth/getSessionServerSide'
const mockCreateSession = createSession as jest.Mock
import {isOrganisationMaintainer} from '~/auth/permissions/isMaintainerOfOrganisation'
const mockIsMaintainer = isOrganisationMaintainer as jest.Mock

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

// MOCK patchOrganisationTable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchOrganisationTable = jest.fn((props) => Promise.resolve({status: 200, statusText: 'OK'}))
jest.mock('./updateOrganisationSettings', () => ({
  patchOrganisationTable: jest.fn((props)=>mockPatchOrganisationTable(props))
}))

describe('frontend/components/organisation/settings/index.tsx', () => {
  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })

  it('renders 401 when not authorised', async() => {
    // mock missing session
    mockCreateSession.mockResolvedValueOnce({
      user: null,
      token: '',
      status: 'missing'
    })

    const ResolvedPage = await OrganisationSettings({slug:['test-project'],query:{}})

    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const p401 = screen.getByRole('heading', {name: '401'})
    expect(p401).toBeInTheDocument()
  })

  it('renders 403 when authorised but not maintainer', async() => {
    // but it is not maintainer of this organisation
    mockProps.isMaintainer = false

    const ResolvedPage = await OrganisationSettings({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const p403 = screen.getByRole('heading', {name: '403'})
    expect(p403).toBeInTheDocument()
  })

  it('renders settings with proper company name', async() => {
    // resolve maintainer to true
    mockIsMaintainer.mockResolvedValueOnce(true)
    // NOTE! session from context is NOT USED
    mockProps.isMaintainer = true

    const ResolvedPage = await OrganisationSettings({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    const nameInput = screen.getByRole('textbox', {
      name:'Name'
    })

    expect(nameInput).toBeInTheDocument()
    expect((nameInput as HTMLInputElement).value).toBe(mockProps.organisation.name)
  })

  it('renders slug, is_tenant when rsd_admin', async() => {
    if (mockSession.user) {
      mockSession.user.role = 'rsd_admin'
      mockSession.status = 'authenticated'
    }

    mockProps.isMaintainer = true

    const ResolvedPage = await OrganisationSettings({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    // slug input
    const slugInput = screen.getByRole('textbox', {
      name:config.slug.label
    })
    expect(slugInput).toBeInTheDocument()

    // is_tenant switch
    const tenantSwitch = screen.getByTestId('controlled-switch')
    expect(tenantSwitch).toBeInTheDocument()
  })

  it('updates name and slug onBlur', async() => {
    if (mockSession.user) {
      mockSession.user.role = 'rsd_admin'
      mockSession.status = 'authenticated'
    }

    const ResolvedPage = await OrganisationSettings({slug:['test-project'],query:{}})

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          {ResolvedPage}
        </WithOrganisationContext>
      </WithAppContext>
    )

    // UPDATE Name
    const updateName = 'Test organisation name'
    const nameInput = screen.getByRole('textbox', {
      name: config.name.label
    })
    // change & blur
    fireEvent.change(nameInput, {target: {value: updateName}})
    fireEvent.blur(nameInput)
    expect(mockPatchOrganisationTable).toHaveBeenCalledTimes(1)
    expect(mockPatchOrganisationTable).toHaveBeenCalledWith({
      'data': {
        'name': updateName,
      },
      'id': mockProps.organisation.id,
      'token': mockSession.token
    })

    // UPDATE slug
    const slugValue = 'test-slug-value'
    const slugInput = screen.getByRole('textbox', {
      name:config.slug.label
    })
    // change & blur
    fireEvent.change(slugInput, {target: {value: slugValue}})
    fireEvent.blur(slugInput)
    // validate
    expect(mockPatchOrganisationTable).toHaveBeenCalledTimes(2)
    expect(mockPatchOrganisationTable).toHaveBeenCalledWith({
      'data': {
        'slug': slugValue,
      },
      'id': mockProps.organisation.id,
      'token': mockSession.token
    })
  })
})
