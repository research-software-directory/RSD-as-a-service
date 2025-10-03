// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'

import defaultSettings from '~/config/defaultSettings.json'
import {RsdSettingsState} from '~/config/rsdSettingsReducer'
import SoftwareEditPage from '~/app/(base)/software/[slug]/edit/[page]/page'
import {initialState as softwareState} from '~/components/software/edit/context/editSoftwareContext'
// import {editSoftwarePage} from '~/components/software/edit/editSoftwarePages'
import editSoftwareData from '~/components/software/edit/information/__mocks__/useSoftwareTableData.json'
import {softwareInformation as config} from '~/components/software/edit/editSoftwareConfig'
import {editSoftwareMenuItems, EditSoftwarePageId} from '~/components/software/edit/editSoftwareMenuItems'

// MOCKS
// we mock default providers used in page header
jest.mock('~/auth/api/useLoginProviders')
// mock user agreement call
jest.mock('~/components/user/settings/agreements/useUserAgreements')
// MOCK global search
jest.mock('~/components/GlobalSearchAutocomplete/apiGlobalSearch')
jest.mock('~/components/GlobalSearchAutocomplete/useHasRemotes')

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
} as any))

// use default mocks
jest.mock('~/components/software/edit/information/useSoftwareTable')
// mock all default software calls
jest.mock('~/components/software/apiSoftware')

const mockProps = {
  // information page
  page: 'information' as EditSoftwarePageId,
  pageIndex: 0,
  software: {
    id:'ca6dbe55-ef59-4f4b-b8bc-eb465e130b87',
    slug: 'test-software-1',
    brand_name: 'Test software 1',
    concept_doi: null,
  }
}

describe.skip('pages/software/[slug]/edit/[page].tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders 401 page when no session', () => {
    render(
      <WithAppContext>
        <WithFormContext>
          <WithSoftwareContext>
            <SoftwareEditPage {...mockProps} />
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
            <SoftwareEditPage {...mockProps} />
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
            <SoftwareEditPage {...mockProps} />
          </WithSoftwareContext>
        </WithFormContext>
      </WithAppContext>
    )
    // wait for loader to be removed
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

  it('does not render communities menu option', async () => {
    // return isMaintainer
    mockIsMaintainer.mockResolvedValueOnce(true)

    // module list without "communities"
    const settings = {
      ...defaultSettings
    }
    settings.modules.communities.active=false

    // render components
    render(
      <WithAppContext options={{
        session: mockSession,
        settings: settings as RsdSettingsState
      }}>
        <WithFormContext>
          <WithSoftwareContext state={softwareState}>
            <SoftwareEditPage {...mockProps} />
          </WithSoftwareContext>
        </WithFormContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // find related-software label
    const relSoftware = editSoftwareMenuItems.find(item=>item.id==='communities')
    expect(relSoftware).toBeDefined()
    if (relSoftware){
      expect(screen.queryByText(relSoftware?.label)).not.toBeInTheDocument()
    }
  })

  it('does not render related-projects menu option', async () => {
    // return isMaintainer
    mockIsMaintainer.mockResolvedValueOnce(true)
    // module list without "projects"
    const settings = {
      ...defaultSettings
    }
    settings.modules.projects.active = false

    // render components
    render(
      <WithAppContext options={{
        session: mockSession,
        settings: settings as RsdSettingsState
      }}>
        <WithFormContext>
          <WithSoftwareContext state={softwareState}>
            <SoftwareEditPage {...mockProps} />
          </WithSoftwareContext>
        </WithFormContext>
      </WithAppContext>
    )
    // wait for loader to be removed
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // find related-software label
    const relSoftware = editSoftwareMenuItems.find(item=>item.id==='related-projects')
    expect(relSoftware).toBeDefined()
    if (relSoftware){
      expect(screen.queryByText(relSoftware?.label)).not.toBeInTheDocument()
    }
  })
})
