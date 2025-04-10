// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import OrganisationSettings from './index'
import config from './general/generalSettingsConfig'
import mockOrganisation from '../__mocks__/mockOrganisation'

// mock user agreement call
jest.mock('~/components/user/settings/agreements/useUserAgreements')

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

  it('renders 401 when not authorised', () => {

    render(
      <WithAppContext>
        <WithOrganisationContext {...mockProps}>
          <OrganisationSettings />
        </WithOrganisationContext>
      </WithAppContext>
    )

    const p401 = screen.getByRole('heading', {name: '401'})
    expect(p401).toBeInTheDocument()
  })

  it('renders 403 when authorised but not maintainer', () => {
    // but it is not maintainer of this organisation
    mockProps.isMaintainer = false

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationSettings />
        </WithOrganisationContext>
      </WithAppContext>
    )

    const p403 = screen.getByRole('heading', {name: '403'})
    expect(p403).toBeInTheDocument()
  })

  it('renders settings with proper company name', () => {

    if (mockSession.user){
      mockSession.user.role = 'rsd_user'
      mockSession.status = 'authenticated'
    }

    mockProps.isMaintainer = true

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationSettings />
        </WithOrganisationContext>
      </WithAppContext>
    )

    const nameInput = screen.getByRole('textbox', {
      name:'Name'
    })

    expect(nameInput).toBeInTheDocument()
    expect((nameInput as HTMLInputElement).value).toBe(mockProps.organisation.name)

  })

  it('renders slug, is_tenant when rsd_admin', () => {
    if (mockSession.user) {
      mockSession.user.role = 'rsd_admin'
      mockSession.status = 'authenticated'
    }

    mockProps.isMaintainer = true

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationSettings />
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

  it('updates name and slug onBlur', () => {
    if (mockSession.user) {
      mockSession.user.role = 'rsd_admin'
      mockSession.status = 'authenticated'
    }
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationSettings />
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
