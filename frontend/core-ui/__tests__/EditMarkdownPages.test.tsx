// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AdminMarkdownPages from '../pages/admin/public-pages'

const mockProps = {
  links:[]
}

// we need to mock this feature - not supported in jsdom
jest.mock('~/utils/useOnUnsavedChange')
// we mock default providers too
jest.mock('~/auth/api/useLoginProviders')

describe('pages/admin/public-pages.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders 401 when not logged in', () => {
    render(
      <WithAppContext>
        <AdminMarkdownPages {...mockProps} />
      </WithAppContext>
    )
    const p401 = screen.getByRole('heading', {
      name:'401'
    })
    expect(p401).toBeInTheDocument()
  })

  it('renders 403 when no rsd_admin role', () => {
    render(
      <WithAppContext options={{session:mockSession}}>
        <AdminMarkdownPages {...mockProps} />
      </WithAppContext>
    )
    const p403 = screen.getByRole('heading', {
      name:'403'
    })
    expect(p403).toBeInTheDocument()
  })

  it('renders add button when rsd_admin', () => {
    if (mockSession.user) {
      mockSession.user.role='rsd_admin'
    }
    mockProps.links=[]
    render(
      <WithAppContext options={{session:mockSession}}>
        <AdminMarkdownPages {...mockProps} />
      </WithAppContext>
    )
    // add button present
    const addBtn = screen.getByRole('button', {
      name:'Add'
    })
    expect(addBtn).toBeInTheDocument()
  })
})
