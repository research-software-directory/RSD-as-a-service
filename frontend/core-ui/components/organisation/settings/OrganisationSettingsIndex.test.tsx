// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import OrganisationSettings from './index'
import {organisationInformation as config} from '../organisationConfig'
import mockOrganisation from '../__mocks__/mockOrganisation'

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

// MOCK patchOrganisationTable
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
        <OrganisationSettings {...mockProps} />
      </WithAppContext>
    )

    const p401 = screen.getByRole('heading', {name: '401'})
    expect(p401).toBeInTheDocument()
  })

  it('renders 403 when authorised but not maintainer', () => {
    mockProps.isMaintainer = false
    render(
      <WithAppContext options={{session:mockSession}}>
        <OrganisationSettings {...mockProps} />
      </WithAppContext>
    )

    const p403 = screen.getByRole('heading', {name: '403'})
    expect(p403).toBeInTheDocument()
  })

  it('renders settings with proper company name', () => {
    mockProps.isMaintainer = true
    render(
      <WithAppContext options={{session: mockSession}}>
        <OrganisationSettings {...mockProps} />
      </WithAppContext>
    )

    const nameInput = screen.getByRole('textbox', {
      name:'Name'
    })

    expect(nameInput).toBeInTheDocument()
    expect((nameInput as HTMLInputElement).value).toBe(mockProps.organisation.name)

  })

  it('renders slug, is_tenant, description when rsd_admin', () => {
    mockProps.isMaintainer = true
    if (mockSession.user) {
      mockSession.user.role = 'rsd_admin'
    }
    const {container} = render(
      <WithAppContext options={{session: mockSession}}>
        <OrganisationSettings {...mockProps} />
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

    // description / about section
    const descriptionInput = container.querySelector('#markdown-textarea')
    expect(descriptionInput).toBeInTheDocument()
  })

  it('updates name,slug and description onBlur', () => {
    mockProps.isMaintainer = true
    if (mockSession.user) {
      mockSession.user.role = 'rsd_admin'
    }
    const {container} = render(
      <WithAppContext options={{session: mockSession}}>
        <OrganisationSettings {...mockProps} />
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
    expect(mockPatchOrganisationTable).toBeCalledTimes(1)
    expect(mockPatchOrganisationTable).toBeCalledWith({
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
    expect(mockPatchOrganisationTable).toBeCalledTimes(2)
    expect(mockPatchOrganisationTable).toBeCalledWith({
      'data': {
        'slug': slugValue,
      },
      'id': mockProps.organisation.id,
      'token': mockSession.token
    })

    // UPDATE description
    const descriptionValue='This is simple test'
    const descriptionInput = container.querySelector('#markdown-textarea') as any
    // change & blur
    fireEvent.change(descriptionInput, {target: {value:descriptionValue}})
    fireEvent.blur(descriptionInput)
    // validate
    expect(mockPatchOrganisationTable).toBeCalledTimes(3)
    expect(mockPatchOrganisationTable).toBeCalledWith({
      'data': {
        'description': descriptionValue,
      },
      'id': mockProps.organisation.id,
      'token': mockSession.token
    })
  })
})
