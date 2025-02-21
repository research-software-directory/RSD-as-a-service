// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import FilterOption from './FilterOption'

const mockProps = {
  // props: document.createAttribute('aria-label'),
  label: 'test label',
  count: 20,
  capitalize: false,
  props:{
    'tabIndex': -1,
    'role': 'option',
    'id': ':r1:-option-2',
    'data-option-index': 2,
    'aria-disabled': false,
    'aria-selected': false,
    'className': 'MuiAutocomplete-option'
  }
}

it('renders filter option label', () => {

  render(
    <FilterOption {...mockProps} />
  )

  screen.getByText(mockProps.label)
  // screen.debug()
})

it('renders filter option label capitalized', () => {
  mockProps.capitalize = true

  render(
    <FilterOption {...mockProps} />
  )

  const div = screen.getByText(mockProps.label)
  expect(div).toHaveClass('capitalize')
})
