// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import {WithAppContext} from '~/utils/jest/WithAppContext'

import EditMentionContext from '~/components/mention/editMentionContext'
import MentionEditSection from './MentionEditSection'
import {EditMentionState} from './editMentionReducer'
import {MentionItemProps} from '~/types/Mention'

// MOCKS
import mentions from './__mocks__/mentions.json'

const mockMentions = mentions as MentionItemProps[]
const mockDispatch = jest.fn()
const mockState:EditMentionState = {
  settings: {
    editModalTitle: 'Test modal title',
    confirmDeleteModalTitle: 'Test delete modal title',
    noItemsComponent:()=><h1>No items component</h1>
  },
  loading: true,
  processing: false,
  mentions:mockMentions,
  editModal: {
    open:false
  },
  confirmModal: {
    open:false
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('renders loader when loading=true', () => {
  render(
    <WithAppContext>
      <EditMentionContext.Provider
        value={{state:mockState,dispatch:mockDispatch}}
      >
        <MentionEditSection />
      </EditMentionContext.Provider>
    </WithAppContext>
  )

  const loader = screen.getByRole('progressbar')
  expect(loader).toBeInTheDocument()
})

it('renders mentions in groups', () => {
  // set loader to false
  mockState.loading = false
  // render component
  render(
    <WithAppContext>
      <EditMentionContext.Provider
        value={{state:mockState,dispatch:mockDispatch}}
      >
        <MentionEditSection />
      </EditMentionContext.Provider>
    </WithAppContext>
  )

  // test highlights section (based on mocked data)
  const hasHighlights = mockMentions.find(item => item.mention_type === 'highlight')
  if (hasHighlights) {
    const highlights = screen.getByRole('heading',{name:'Highlights'})
    expect(highlights).toBeInTheDocument()
  }

  // expect all base mention items on page
  const mentions = screen.getAllByTestId('mention-item-base')
  // take highlights out
  const baseItems = mockMentions.filter(item=>item.mention_type!=='highlight')
  expect(mentions.length).toEqual(baseItems.length)
})


it('renders no items component', () => {
  // set loader to false
  mockState.loading = false
  mockState.mentions = []
  // render component
  render(
    <WithAppContext>
      <EditMentionContext.Provider
        value={{state:mockState,dispatch:mockDispatch}}
      >
        <MentionEditSection />
      </EditMentionContext.Provider>
    </WithAppContext>
  )

  const noItemsMsg = screen.getByText('No items component')
  expect(noItemsMsg).toBeInTheDocument()
})
