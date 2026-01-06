// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@testing-library/react'

import {WithAppContext} from '~/utils/jest/WithAppContext'
import MuiSnackbarProvider from './MuiSnackbarProvider'
import useSnackbar from './useSnackbar'

function WithMuiSnackbar({type, message}: {type: string, message: string}) {
  const {showErrorMessage,showSuccessMessage,showInfoMessage,showWarningMessage} = useSnackbar()

  function showMessage() {
    switch (type) {
      case 'error':
        showErrorMessage(message)
        break
      case 'success':
        showSuccessMessage(message)
        break
      case 'warning':
        showWarningMessage(message)
        break
      case 'info':
        showInfoMessage(message)
        break
      default:
        throw('message type not supported')
    }
  }

  return (
    <button onClick={showMessage}>
      Show Message
    </button>
  )
}

it('renders snackbar error message', () => {

  const mockProps = {
    type: 'error',
    message: 'Test error message'
  }

  render(
    <WithAppContext>
      <MuiSnackbarProvider>
        <WithMuiSnackbar {...mockProps} />
      </MuiSnackbarProvider>
    </WithAppContext>
  )

  // fire error message
  const btn = screen.getByRole('button')
  fireEvent.click(btn)

  // validate error icon and text shown
  screen.getByTestId('ErrorOutlineIcon')
  screen.getByText(mockProps.message)
})

it('renders snackbar success message', () => {

  const mockProps = {
    type: 'success',
    message: 'Test success message'
  }

  render(
    <WithAppContext>
      <MuiSnackbarProvider>
        <WithMuiSnackbar {...mockProps} />
      </MuiSnackbarProvider>
    </WithAppContext>
  )

  // fire message
  const btn = screen.getByRole('button')
  fireEvent.click(btn)

  // validate success icon and text shown
  screen.getByTestId('SuccessOutlinedIcon')
  screen.getByText(mockProps.message)
})

it('renders snackbar warning message', () => {

  const mockProps = {
    type: 'warning',
    message: 'Test warning message'
  }

  render(
    <WithAppContext>
      <MuiSnackbarProvider>
        <WithMuiSnackbar {...mockProps} />
      </MuiSnackbarProvider>
    </WithAppContext>
  )

  // fire message
  const btn = screen.getByRole('button')
  fireEvent.click(btn)

  // validate warning icon shown
  screen.getByTestId('ReportProblemOutlinedIcon')
  screen.getByText(mockProps.message)
})

it('renders snackbar info message', () => {

  const mockProps = {
    type: 'info',
    message: 'Test info message'
  }

  render(
    <WithAppContext>
      <MuiSnackbarProvider>
        <WithMuiSnackbar {...mockProps} />
      </MuiSnackbarProvider>
    </WithAppContext>
  )

  // fire message
  const btn = screen.getByRole('button')
  fireEvent.click(btn)

  // validate info icon shown
  screen.getByTestId('InfoOutlinedIcon')
  screen.getByText(mockProps.message)
})
