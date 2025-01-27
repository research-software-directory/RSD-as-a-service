// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithOrganisationContext} from '~/utils/jest/WithOrganisationContext'

import {Session} from '~/auth'

import OrganisationAboutPage from './index'

// MOCKS
import mockOrganisation from '~/components/organisation/__mocks__/mockOrganisation'

const mockPatchOrganisationTable = jest.fn()
jest.mock('../updateOrganisationSettings', () => ({
  patchOrganisationTable: async(props:any)=>mockPatchOrganisationTable(props)
}))

const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_user'
  }
} as Session

const mockProps = {
  organisation: mockOrganisation,
  isMaintainer: false
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('components/organisation/releases/index.tsx', () => {

  it('can update markdown input', async() => {
    const markdown = '# Test title'
    mockPatchOrganisationTable.mockResolvedValueOnce({status:200,message:'OK'})

    render(
      <WithAppContext options={{session: testSession}}>
        <WithOrganisationContext {...mockProps}>
          <OrganisationAboutPage />
        </WithOrganisationContext>
      </WithAppContext>
    )

    const preview = screen.getByRole('tab', {name: 'Preview'})

    // change input
    const input = screen.getByRole('textbox')
    fireEvent.change(input,{target:{value:markdown}})
    // trigger save
    fireEvent.blur(input)

    // move to preview
    fireEvent.click(preview)
    // confirm markdown present
    screen.getByText(markdown)

    await waitFor(() => {
      expect(mockPatchOrganisationTable).toHaveBeenCalledTimes(1)
      expect(mockPatchOrganisationTable).toHaveBeenCalledWith({
        'data':{
          'description': markdown,
        },
        'id': mockProps.organisation.id,
        'token': testSession.token,
      })
    })
  })
})
