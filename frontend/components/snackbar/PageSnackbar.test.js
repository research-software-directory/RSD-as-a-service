import {render, screen} from '@testing-library/react'

import PageSnackbar from './PageSnackbar'

//mock snackbar action
const setSnackbar = jest.fn()
//mock options
const mockOptions={
  severity: 'error',
  message: 'TEST_ERROR_MESSAGE',
  open: true,
}

afterEach(()=>{
  jest.clearAllMocks()
})

it('does NOT render snackbar when open=false',()=>{
  mockOptions.open = false
  render(<PageSnackbar options={mockOptions} setOptions={setSnackbar} />)
  const found = screen.queryByText(mockOptions.message)
  expect(found).toEqual(null)
})

it('renders snackbar with mocked ERROR message',()=>{
  mockOptions.severity = 'error'
  mockOptions.message = 'TEST_ERROR_MESSAGE'
  mockOptions.open = true
  render(<PageSnackbar options={mockOptions} setOptions={setSnackbar} />)
  const msg = screen.getByText(mockOptions.message)
  expect(msg).toBeInTheDocument()
})

it('renders snackbar with mocked INFO message',()=>{
  mockOptions.severity = 'info'
  mockOptions.message = 'TEST_INFO_MESSAGE'
  mockOptions.open = true
  render(<PageSnackbar options={mockOptions} setOptions={setSnackbar} />)
  const msg = screen.getByText(mockOptions.message)
  expect(msg).toBeInTheDocument()
})

it('renders snackbar with mocked SUCCESS message',()=>{
  mockOptions.severity = 'success'
  mockOptions.message = 'TEST_SUCCESS_MESSAGE'
  mockOptions.open = true
  render(<PageSnackbar options={mockOptions} setOptions={setSnackbar} />)
  const msg = screen.getByText(mockOptions.message)
  expect(msg).toBeInTheDocument()
})

it('renders snackbar with mocked WARNING message',()=>{
  mockOptions.severity = 'warning'
  mockOptions.message = 'TEST_WARNING_MESSAGE'
  mockOptions.open = true
  render(<PageSnackbar options={mockOptions} setOptions={setSnackbar} />)
  const msg = screen.getByText(mockOptions.message)
  expect(msg).toBeInTheDocument()
})

