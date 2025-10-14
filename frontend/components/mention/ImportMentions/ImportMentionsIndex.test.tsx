// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import ImportMentionsIndex from './index'
import {Session} from '~/auth'
import MuiSnackbarProvider from '~/components/snackbar/MuiSnackbarProvider'

// MOCK useValidateInputList - use default mock
jest.mock('./apiImportMentions')

const testSession = {
  ...mockSession,
  user: {
    ...mockSession.user,
    role: 'rsd_admin'
  }
} as Session


const mockOnSuccess = jest.fn()

const mockProps = {
  table: 'mention_for_software',
  entityId: 'software-id',
  onSuccess: mockOnSuccess
} as any

const mockDoiList = [
  '10.5270/esa-nzfsox4',
  '10.1555/mars.2006.0005',
  '10.23943/princeton/9780691209258.003.0001'
]


describe('components/mention/ImportMentions/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('validates provided doi list', async() => {

    render(
      <WithAppContext options={{session: testSession}}>
        <ImportMentionsIndex {...mockProps} />
      </WithAppContext>
    )

    // has import button
    const importBtn = screen.getByRole('button',{name: 'Import'})

    fireEvent.click(importBtn)

    // shows dialog
    const importDialog = screen.getByRole('dialog',{name: 'Import publications'})

    // has two buttons
    const btns = within(importDialog).getAllByRole('button')
    expect(btns.length).toBe(2)

    // Next button is disabled
    expect(btns[1]).toBeDisabled()

    // input DOI's
    const input = screen.getByRole('textbox')
    fireEvent.change(input,{target:{value:mockDoiList.join('\n')}})

    // check Next in enabled
    expect(btns[1]).toBeEnabled()

    // click next
    fireEvent.click(btns[1])

    // shows Import button after succefol validation
    await screen.findByRole('button',{name:'Import'})

    // reports all doi items we provided
    const reportItems = screen.getAllByTestId('import-mention-report-item')
    expect(reportItems.length).toEqual(mockDoiList.length)

    // cancel button
    const cancel = screen.getByRole('button', {name: 'Cancel'})
    fireEvent.click(cancel)
    // validate dialog is removed
    expect(importDialog).not.toBeInTheDocument()
    // screen.debug()
  })

  it('imports provided doi list', async() => {

    render(
      <WithAppContext options={{session: testSession}}>
        <MuiSnackbarProvider>
          <ImportMentionsIndex {...mockProps} />
        </MuiSnackbarProvider>
      </WithAppContext>
    )

    // has import button
    const importBtn = screen.getByRole('button',{name: 'Import'})

    fireEvent.click(importBtn)

    // shows dialog
    const importDialog = screen.getByRole('dialog',{name: 'Import publications'})

    // has two buttons
    const btns = within(importDialog).getAllByRole('button')
    expect(btns.length).toBe(2)

    // Next button is disabled
    expect(btns[1]).toBeDisabled()

    // input DOI's
    const input = screen.getByRole('textbox')
    fireEvent.change(input,{target:{value:mockDoiList.join('\n')}})

    // check Next in enabled
    expect(btns[1]).toBeEnabled()

    // click next
    fireEvent.click(btns[1])

    // shows Import button after succefol validation
    await screen.findByRole('button',{name:'Import'})

    // reports all doi items we provided
    const reportItems = screen.getAllByTestId('import-mention-report-item')
    expect(reportItems.length).toEqual(mockDoiList.length)

    // has select to import buttons
    // const switches = screen.getAllByTestId('switch-toggle-button')
    const switches = screen.getAllByRole('switch')
    expect(switches.length).toEqual(switches.length)

    // deselect first item
    fireEvent.click(switches[0])
    expect(switches[0]).not.toBeChecked()

    // Import button
    const impBtn = screen.getByRole('button', {name: 'Import'})
    fireEvent.click(impBtn)

    await waitFor(() => {
      // calls onSuccess fn
      expect(mockProps.onSuccess).toHaveBeenCalledTimes(1)
      // shows snackbar success message
      screen.getByTestId('SuccessOutlinedIcon')
      // screen.debug()
    })
  })
})
