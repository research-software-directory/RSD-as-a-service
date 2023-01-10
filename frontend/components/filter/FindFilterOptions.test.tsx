// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '~/utils/jest/WrappedComponents'

import FindFilterOptions from './FindFilterOptions'

const mockSearchApi = jest.fn()
const mockOnAdd = jest.fn()
const mockItemsToOptions = jest.fn()

const mockName='Select or type a keyword'
const mockProps = {
  config:{
    freeSolo: false,
    minLength: 0,
    label: mockName,
    help: '',
    reset: true,
    noOptions: {
      empty: 'Type keyword',
      minLength: 'Too short',
      notFound: 'There are no projects with this keyword'
    }
  },
  searchApi: mockSearchApi,
  onAdd: mockOnAdd,
  itemsToOptions: mockItemsToOptions
}

beforeEach(() => {
  jest.resetAllMocks()
})

it('renders component with input/combobox', () => {
  render(WrappedComponentWithProps(FindFilterOptions, {
    props: mockProps
  }))

  const input = screen.getByRole('combobox', {
    name: mockName
  })

  expect(input).toBeInTheDocument()
})

it('makes initial call to searchApi', () => {
  // mock response
  mockSearchApi.mockResolvedValueOnce(['item 1', 'item 2', 'item 3'])
  // render component
  render(WrappedComponentWithProps(FindFilterOptions, {
    props: mockProps
  }))

  // expect api to be called
  expect(mockSearchApi).toBeCalledTimes(1)
  expect(mockSearchApi).toBeCalledWith({searchFor: ''})
  // screen.debug()
})

