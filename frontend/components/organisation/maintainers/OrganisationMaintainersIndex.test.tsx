// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {defaultSession} from '~/auth'

import OrganisationMaintainers from './index'
import mockOrganisation from '../__mocks__/mockOrganisation'

// MOCK user agreement call
jest.mock('~/components/user/settings/fetchAgreementStatus')

const mockMaintainerOfOrganisation=jest.fn<Promise<any[]>,any[]>((props)=>Promise.resolve([]))
jest.mock('./getMaintainersOfOrganisation', () => ({
  getMaintainersOfOrganisation:jest.fn((props)=>mockMaintainerOfOrganisation(props))
}))

// MOCK unused invitations api call
const getUnusedInvitations = jest.fn((props) => {
  // console.log('mocked...getUnusedInvitations...props...', props)
  return Promise.resolve([])
})
// Mock
jest.mock('~/utils/getUnusedInvitations', () => {
  return {
    getUnusedInvitations:jest.fn((props)=>getUnusedInvitations(props))
  }
})

const dummyProps = {
  organisation: mockOrganisation,
  isMaintainer: true
}

describe('frontend/components/organisation/maintainers/index.tsx', () => {

  beforeEach(() => {
    // reset mock counters
    jest.clearAllMocks()
  })


  it('shows 401 when no token provided', () => {
    render(<OrganisationMaintainers {...dummyProps} />)
    const msg401 = screen.getByRole('heading', {
      name: '401'
    })
    expect(msg401).toBeInTheDocument()
  })

  it('shows loader during api request', async () => {
    // user is authenticated
    defaultSession.status = 'authenticated'
    defaultSession.token = 'test-token'
    // but it is not maintainer of this organisation
    dummyProps.isMaintainer = false
    render(
      <WithAppContext options={{session: defaultSession}}>
        <OrganisationMaintainers {...dummyProps} />
      </WithAppContext>
    )

    const loader = await screen.findByRole('progressbar')
    expect(loader).toBeInTheDocument()

    expect(mockMaintainerOfOrganisation).toBeCalledTimes(1)
    expect(mockMaintainerOfOrganisation).toBeCalledWith({
      organisation: dummyProps.organisation.id,
      token: defaultSession.token,
      frontend: true
    })
  })

  it('shows 403 when user is not organisation maintainer', async () => {
    // user is authenticated
    defaultSession.status = 'authenticated'
    defaultSession.token = 'test-token'
    // but it is not maintainer of this organisation
    dummyProps.isMaintainer = false
    render(
      <WithAppContext options={{session: defaultSession}}>
        <OrganisationMaintainers {...dummyProps} />
      </WithAppContext>
    )
    const msg403 = await screen.findByRole('heading', {
      name: '403'
    })
    expect(msg403).toBeInTheDocument()
  })

  it('shows "No maintainers" message', async () => {
    // user is authenticated
    defaultSession.status = 'authenticated'
    defaultSession.token = 'test-token'
    // but it is not maintainer of this organisation
    dummyProps.isMaintainer = true

    // mock empty response array
    mockMaintainerOfOrganisation.mockResolvedValueOnce([])

    render(
      <WithAppContext options={{session: defaultSession}}>
        <OrganisationMaintainers {...dummyProps} />
      </WithAppContext>
    )
    const noMaintainers = await screen.findByText('No maintainers')
    expect(noMaintainers).toBeInTheDocument()
  })

  it('shows maintainer list item', async () => {
    // MOCK maintainers call
    const dummyRawMaintainers = [{
      'maintainer': 'a050aaf3-9c46-490c-ade3-aeeb6a05b1d1',
      'name': ['Jordan Ross Belfort'],
      'email': ['Jordan.Belfort@harvard-example.edu'],
      'affiliation': ['harvard-example.edu'],
      'is_primary': false
    }]
    // mock empty response array
    mockMaintainerOfOrganisation.mockResolvedValueOnce(dummyRawMaintainers)
    // user is authenticated
    defaultSession.status = 'authenticated'
    defaultSession.token = 'test-token'
    // but it is not maintainer of this organisation
    dummyProps.isMaintainer = true

    render(
      <WithAppContext options={{session: defaultSession}}>
        <OrganisationMaintainers {...dummyProps} />
      </WithAppContext>
    )

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

    const maintainer = await screen.findByText(dummyRawMaintainers[0].name[0])
    expect(maintainer).toBeInTheDocument()
  })

  it('renders component with "Generate invite link" button', async () => {
    render(
      <WithAppContext options={{session: mockSession}}>
        <OrganisationMaintainers organisation={mockOrganisation} isMaintainer={true} />
      </WithAppContext>
    )
    // wait loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const inviteBtn = screen.getByRole('button', {name: 'Generate invite link'})
    expect(inviteBtn).toBeInTheDocument()
    // screen.debug()
  })

  it('protects maintainer page when isMaintainer=false', async () => {
    render(
      <WithAppContext options={{session: mockSession}}>
        <OrganisationMaintainers organisation={mockOrganisation} isMaintainer={false} />
      </WithAppContext>
    )
    // wait loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const page403 = screen.getByRole('heading', {name: '403'})
    expect(page403).toBeInTheDocument()
    // screen.debug()
  })

  it('shows no maintainer message when maintainers=[]', async () => {
    render(
      <WithAppContext options={{session: mockSession}}>
        <OrganisationMaintainers organisation={mockOrganisation} isMaintainer={true} />
      </WithAppContext>
    )
    // wait loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const noItemsMsg = screen.getByText('No maintainers')
    expect(noItemsMsg).toBeInTheDocument()
  })

  it('shows maintainer list', async () => {
    const mockMaintainers = [
      {account: 'test-account-id', name: ['John Doe'], email: [], affiliation: [], is_primary: false},
      {account: 'test-account-id', name: ['John Doe'], email: [], affiliation: [], is_primary: false},
    ]
    mockMaintainerOfOrganisation.mockResolvedValueOnce(mockMaintainers)
    render(
      <WithAppContext options={{session: mockSession}}>
        <OrganisationMaintainers organisation={mockOrganisation} isMaintainer={true} />
      </WithAppContext>
    )
    // wait loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const maintainerItem = screen.getAllByTestId('maintainer-list-item')
    expect(maintainerItem.length).toEqual(mockMaintainers.length)
  })

})
