// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithFormContext} from '~/utils/jest/WithFormContext'
import {projectInformation} from './information/config'

import EditProjectPage from './EditProjectPage'

// MOCK isMaintainer method to avoid api call
const mockIsMaintainer = jest.fn(props => Promise.resolve(false))
jest.mock('~/auth/permissions/isMaintainerOf', () => {
  // console.log('isMaintainerOf...MOCK')
  return {
    isMaintainerOf: jest.fn((props) => mockIsMaintainer(props))
  }
})
// MOCK useProjecToEdit data hook (uses default mock from __mocks__)
jest.mock('~/components/projects/edit/information/useProjectToEdit')
// MOCK useStickyHeader, IntersectionObserver not present in jsdom (uses default mock from __mocks__)
jest.mock('~/components/layout/useStickyHeaderBorder')

it('renders 401 when not authenticated', () => {
  render(
    <WithAppContext>
      <WithProjectContext>
        <EditProjectPage slug="test-slug" />
      </WithProjectContext>
    </WithAppContext>
  )

  const e401 = screen.getByRole('heading',{name:'401'})
  expect(e401).toBeInTheDocument()
})

it('render 403 when authenticated but not maintainer', async() => {
  // mock response isMaintainer to be true
  mockIsMaintainer.mockResolvedValueOnce(false)

  render(
    <WithAppContext options={{session:mockSession}}>
      <WithProjectContext>
        <EditProjectPage slug="test-slug" />
      </WithProjectContext>
    </WithAppContext>
  )

  // we need to wait for loader to be removed
  await waitForElementToBeRemoved(screen.getByRole('progressbar'))

  const e403 = screen.getByRole('heading',{name:'403'})
  expect(e403).toBeInTheDocument()
})

it('renders first step heading (Project information) by default', async() => {
  // mock response isMaintainer to be true
  mockIsMaintainer.mockResolvedValueOnce(true)

  // render component
  render(
    <WithAppContext options={{session:mockSession}}>
      <WithProjectContext>
        <WithFormContext>
          <EditProjectPage slug="test-slug" />
        </WithFormContext>
      </WithProjectContext>
    </WithAppContext>
  )

  // wait for loader to be removed
  await waitForElementToBeRemoved(screen.getByRole('progressbar'))

  // then we wait for heading to appear after all (mocked) data is received
  const title = await screen.findByRole('heading', {
    name: projectInformation.sectionTitle
  })
  expect(title).toBeInTheDocument()
})
