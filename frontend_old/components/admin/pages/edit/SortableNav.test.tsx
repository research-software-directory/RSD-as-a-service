// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {render} from '@testing-library/react'
import {WithFormContext} from '~/utils/jest/WithFormContext'

import SortableNav from './SortableNav'

const links = [
  {id:'id-1',position:0,title:'Link title 1',slug:'slug-1',is_published:true},
  {id:'id-2',position:1,title:'Link title 2',slug:'slug-2',is_published:true},
  {id:'id-3',position:2,title:'Link title 3',slug:'slug-3',is_published:false}
]

const mockOnSelect = jest.fn()
const mockOnSorted = jest.fn()

const mockProps = {
  links,
  selected: links[0].slug,
  onSelect: mockOnSelect,
  onSorted: mockOnSorted
}

// we need to mock this feature - not supported in jsdom
jest.mock('~/utils/useOnUnsavedChange')

it('renders component with list items', () => {
  const {container} = render(
    <WithFormContext>
      <SortableNav {...mockProps} />
    </WithFormContext>
  )

  const items = container.querySelectorAll('li')
  expect(items.length).toEqual(3)

})
