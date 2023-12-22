// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitForElementToBeRemoved, within} from '@testing-library/react'

import MuiSnackbarProvider from '~/components/snackbar/MuiSnackbarProvider'
import ValidateConceptDoi from './ValidateConceptDoi'

// MOCKS
const mockOnUpdate = jest.fn()
const mockProps = {
  doi: '',
  onUpdate: mockOnUpdate
}

const mockGetSoftwareVersionInfoForDoi = jest.fn(props => Promise.resolve({
  status: 200,
  data: {
    software: {
      versionOfCount: 1
    }
  }
} as any))
jest.mock('~/utils/getDataCite', () => ({
  getSoftwareVersionInfoForDoi: jest.fn(props=>mockGetSoftwareVersionInfoForDoi(props))
}))

beforeEach(() => {
  jest.clearAllMocks()
})

it('does NOT render when no DOI', () => {
  // render
  render(
    <ValidateConceptDoi {...mockProps} />
  )
  // ensure button not shown
  const validateBtn = screen.queryByRole('button')
  expect(validateBtn).not.toBeInTheDocument()
})

it('renders validate DOI button', () => {
  // provide DOI
  mockProps.doi = '10.1017/9781009085809'
  // render
  render(
    <ValidateConceptDoi {...mockProps} />
  )
  // ensure button not shown
  const validateBtn = screen.queryByRole('button')
  expect(validateBtn).toBeInTheDocument()
})

it('shows valid concept DOI message', async() => {
  // provide DOI
  mockProps.doi = '10.1017/9781009085809'
  // mock response for valid Concept DOI
  mockGetSoftwareVersionInfoForDoi.mockResolvedValueOnce({
    status: 200,
    'data': {
      'software': {
        'relatedIdentifiers': [
          {
            'relationType': 'IsSupplementTo',
            'relatedIdentifierType': 'URL',
            'relatedIdentifier': 'https://github.com/UtrechtUniversity/animal-sounds/tree/v0.0.1-alpha'
          },
          {
            'relationType': 'HasVersion',
            'relatedIdentifierType': 'DOI',
            'relatedIdentifier': '10.5281/zenodo.7137567'
          }
        ]
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
  const validDOI = screen.getByText(`The DOI ${mockProps.doi} is a valid Concept DOI`)
})

it('shows version DOI message and suggest concept DOI', async() => {
  // provide DOI
  mockProps.doi = '10.1017/9781009085809'
  const conceptDOI = '10.5281/zenodo.7137566'
  // mock response for valid Concept DOI
  mockGetSoftwareVersionInfoForDoi.mockResolvedValueOnce({
    status: 200,
    'data': {
      'software': {
        'relatedIdentifiers': [
          {
            'relationType': 'IsSupplementTo',
            'relatedIdentifierType': 'URL',
            'relatedIdentifier': 'https://github.com/UtrechtUniversity/animal-sounds/tree/v0.0.1-alpha'
          },
          {
            'relationType': 'IsVersionOf',
            'relatedIdentifierType': 'DOI',
            'relatedIdentifier': '10.5281/zenodo.7137566'
          }
        ]
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
  const versionDOI = screen.getByText(`This is a version DOI. The Concept DOI is ${conceptDOI}`)
})
