// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'

import SoftwareEditPage from '../pages/software/[slug]/edit'
import {initialState as softwareState} from '~/components/software/edit/editSoftwareContext'
import {editSoftwarePage} from '~/components/software/edit/editSoftwareSteps'
import editSoftwareData from '~/components/software/edit/information/__mocks__/useSoftwareToEditData.json'
import {softwareInformation as config} from '~/components/software/edit/editSoftwareConfig'

// MOCKS
// we mock default providers used in page header
jest.mock('~/auth/api/useLoginProviders')
// mock user agreement call
jest.mock('~/components/user/settings/fetchAgreementStatus')


// MOCK isMaintainerOf
const mockIsMaintainer = jest.fn(props => Promise.resolve(false))
jest.mock('~/auth/permissions/isMaintainerOf', () => ({
  isMaintainerOf: jest.fn(props=>mockIsMaintainer(props))
}))

// MOCK IntersectionObserver
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
// you can also pass the mock implementation
// to jest.fn as an argument
window.IntersectionObserver = jest.fn(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
}))

jest.mock('~/components/software/edit/information/useSoftwareToEdit')

describe('pages/software/[slug]/edit/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders 401 page when no session', () => {
    render(
      <WithAppContext>
        <WithFormContext>
          <WithSoftwareContext>
            <SoftwareEditPage />
          </WithSoftwareContext>
        </WithFormContext>
      </WithAppContext>
    )

    const p401 = screen.getByRole('heading', {
      name: '401'
    })
    expect(p401).toBeInTheDocument()
  })

  it('renders 403 page when isMaintainer=false', async () => {
    // mock no maintainer
    mockIsMaintainer.mockResolvedValueOnce(false)

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithFormContext>
          <WithSoftwareContext>
            <SoftwareEditPage />
          </WithSoftwareContext>
        </WithFormContext>
      </WithAppContext>
    )

    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    const p403 = screen.getByRole('heading', {
      name: '403'
    })
    expect(p403).toBeInTheDocument()
  })

  it('renders info content when isMaintainer=true', async () => {
    // return isMaintainer
    mockIsMaintainer.mockResolvedValueOnce(true)
    // render components
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithFormContext>
          <WithSoftwareContext state={softwareState}>
            <SoftwareEditPage />
          </WithSoftwareContext>
        </WithFormContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    //validate all nav items shown
    const navItems = screen.getAllByTestId('edit-software-nav-item')
    expect(navItems.length).toEqual(editSoftwarePage.length)

    // wait for info loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // validate info section is loaded
    const editInfoForm = await screen.findByTestId('software-information-form')
    expect(editInfoForm).toBeInTheDocument()

    // validate project title
    const brand_name = screen.getByRole('textbox', {
      name: config.brand_name.label
    })
    expect(brand_name).toHaveValue(editSoftwareData.brand_name)
  })
})
