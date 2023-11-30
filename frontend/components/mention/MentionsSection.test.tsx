// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'

import MentionsSection from './MentionsSection'
import mentions from './__mocks__/mentions.json'
import {MentionItemProps} from '~/types/Mention'

const testTitle = 'Test title'
const mentionsData = mentions as MentionItemProps[]

it('should NOT render mentions section when no data provided',()=>{
  render(
    <MentionsSection title="" mentions={[]}/>
  )
  const title = screen.queryByTestId('software-mentions-section-title')
  expect(title).not.toBeInTheDocument()
  // screen.debug()
})

it('should render mention section title when data provided',()=>{

  render(
    <MentionsSection title={testTitle} mentions={mentionsData}/>
  )
  screen.getByText(testTitle)
  // const title = screen.queryByTestId('software-mentions-section-title')
  // expect(title).toBeInTheDocument()
  // screen.debug()
})

it('should render featured mention items (based on dummy data)',()=>{
  render(
    <MentionsSection title={testTitle} mentions={mentionsData}/>
  )
  const expectedItems = mentionsData.filter(item=>item.mention_type==='highlight')
  const featured = screen.queryAllByTestId('mention-is-featured')
  expect(featured.length).toEqual(expectedItems.length)
  // screen.debug()
})

it('should render mention type sections (except mention_type===highlight)',()=>{
  render(
    <MentionsSection title={testTitle} mentions={mentionsData}/>
  )
  const highlight = mentionsData.filter(item => item.mention_type === 'highlight')
  const expectedCount = mentionsData.length - highlight.length
  const mentions = screen.queryAllByTestId('mentions-section-for-type')
  expect(mentions.length).toEqual(expectedCount)
  // screen.debug()
})

it('should render all not featured mention items (based on dummy data)',()=>{
  render(
    <MentionsSection title={testTitle} mentions={mentionsData}/>
  )
  const expectedItems = mentionsData.filter(item=>item.mention_type!=='highlight')
  const mentionItems = screen.queryAllByTestId('mention-view-item-body')
  expect(mentionItems.length).toEqual(expectedItems.length)
  // screen.debug()
})
