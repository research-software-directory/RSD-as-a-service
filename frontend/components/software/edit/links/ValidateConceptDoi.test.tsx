// SPDX-FileCopyrightText: 2023 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitForElementToBeRemoved, within} from '@testing-library/react'

import MuiSnackbarProvider from '~/components/snackbar/MuiSnackbarProvider'
import ValidateConceptDoi from './ValidateConceptDoi'

// MOCKS
const mockOnUpdate = jest.fn()
const mockProps = {
  doi: '',
  onUpdate: mockOnUpdate,
  disabled: true
}

const mockGetSoftwareVersionInfoForDoi = jest.fn()

jest.mock('~/utils/getDataCite', () => {
  const originalModule = jest.requireActual('~/utils/getDataCite')
  return ({
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getDataciteItemByDoi: jest.fn(props=>mockGetSoftwareVersionInfoForDoi(props))
  })
})

beforeEach(() => {
  jest.clearAllMocks()
})

it('disabled button when disabled=true ', () => {
  mockProps.disabled = true
  // render
  render(
    <ValidateConceptDoi {...mockProps} />
  )
  // ensure button not shown
  const validateBtn = screen.queryByRole('button')
  expect(validateBtn).toBeDisabled()
})

it('enabled validate DOI button', () => {
  // provide DOI
  mockProps.doi = '10.1017/9781009085809'
  mockProps.disabled = false
  // render
  render(
    <ValidateConceptDoi {...mockProps} />
  )
  // ensure button not shown
  const validateBtn = screen.queryByRole('button')
  expect(validateBtn).not.toBeDisabled()
})

it('shows valid concept DOI message', async() => {
  const doi = '10.1017/9781009085809'
  // provide DOI
  mockProps.doi = doi
  mockProps.disabled = false
  // mock response for valid Concept DOI
  mockGetSoftwareVersionInfoForDoi.mockResolvedValueOnce({
    status: 200,
    message: {
      attributes: {
        doi: doi
      }
      ,
      relationships: {
        versionOf: {
          data: [
            {
              id: doi,
              type: 'dois'
            }
          ]
        }
      }
    }
  })
  // render
  render(
    <MuiSnackbarProvider>
      <ValidateConceptDoi {...mockProps} />
    </MuiSnackbarProvider>
  )

  // ensure button not shown
  const validateBtn = screen.getByRole('button')
  fireEvent.click(validateBtn)
  // wait loader to disappear
  await waitForElementToBeRemoved(within(validateBtn).getByRole('progressbar'))
  // valid DOI message shown
  screen.getByText(`The DOI ${mockProps.doi} is a valid Concept DOI`)
})

it('calls onUpdate with concept DOI when version DOI provided', async() => {
  const doi = '10.1017/9781009085809'
  // provide DOI
  mockProps.doi = doi
  mockProps.disabled = false
  const conceptDOI = '10.5281/zenodo.7137566'
  // mock response for valid Concept DOI
  mockGetSoftwareVersionInfoForDoi.mockResolvedValueOnce({
    status: 200,
    message: {
      attributes: {
        doi: doi
      }
      ,
      relationships: {
        versionOf: {
          data: [
            {
              id: conceptDOI,
              type: 'dois'
            }
          ]
        }
      }
    }
  })
  // render
  render(
    <MuiSnackbarProvider>
      <ValidateConceptDoi {...mockProps} />
    </MuiSnackbarProvider>
  )
  // ensure button not shown
  const validateBtn = screen.getByRole('button')
  fireEvent.click(validateBtn)
  // wait loader to disappear
  await waitForElementToBeRemoved(within(validateBtn).getByRole('progressbar'))
  // valid DOI message shown
  // const versionDOI = screen.getByText(`This is a version DOI. The Concept DOI is ${conceptDOI}`)
  expect(mockOnUpdate).toHaveBeenCalledTimes(1)
  expect(mockOnUpdate).toHaveBeenCalledWith(conceptDOI)
})
