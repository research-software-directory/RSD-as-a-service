// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithSoftwareContext} from '~/utils/jest/WithSoftwareContext'

import SoftwareCitationsTab from './index'

// MOCKS
import {initialState as softwareState} from '~/components/software/edit/context/editSoftwareContext'
import citationForSoftware from './__mocks__/citationsForSoftware.json'

// MOCK software mention context
const mockSoftwareMentionContext={
  loading: true,
  reference_papers: [],
  citations: [],
  output: [],
  counts:{
    reference_papers: 0,
    citations: 0,
    output: 0,
  },
  tab:'reference_papers',
  setTab:jest.fn(),
  setOutputCnt:jest.fn(),
  setCitationCnt:jest.fn(),
  setReferencePapersCnt:jest.fn()
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseSoftwareMentionContext = jest.fn(props=>mockSoftwareMentionContext)
jest.mock('~/components/software/edit/mentions/SoftwareMentionContext',()=>({
  useSoftwareMentionContext: jest.fn(props=>mockUseSoftwareMentionContext(props))
}))

describe('frontend/components/software/edit/mentions/outputindex.tsx', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loader when loading=true',()=>{
    mockSoftwareMentionContext.loading=true
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)

    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareCitationsTab />
        </WithSoftwareContext>
      </WithAppContext>
    )

    screen.getByRole('progressbar')
  })

  it('renders mocked citations, ONLY first 50 items per group', async () => {
    // required software id
    softwareState.id = 'test-software-id'
    // mock items
    mockSoftwareMentionContext.loading = false
    mockSoftwareMentionContext.citations = citationForSoftware as any
    mockUseSoftwareMentionContext.mockReturnValueOnce(mockSoftwareMentionContext)
    // render
    render(
      <WithAppContext options={{session: mockSession}}>
        <WithSoftwareContext state={softwareState}>
          <SoftwareCitationsTab />
        </WithSoftwareContext>
      </WithAppContext>
    )

    const mentions = screen.getAllByTestId('mention-view-item-body')

    // NOTE! we render ONLY first 50 items per group,
    // therefore the length of shown items is NOT equal to data length
    // citationForSoftware.length != 96
    expect(mentions.length).toEqual(96)
  })

})
