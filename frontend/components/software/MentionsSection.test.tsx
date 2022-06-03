// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'

import MentionsSection from './MentionsSection'
import mentionsData from './__fixtures__/mentionSectionData.json'

it('should NOT render mentions section when no data provided',()=>{
  render(WrappedComponentWithProps(MentionsSection))
  const title = screen.queryByTestId('software-mentions-section-title')
  expect(title).not.toBeInTheDocument()
  // screen.debug()
})

it('should render mention section title when data provided',()=>{
  render(WrappedComponentWithProps(MentionsSection, {
    props:{mentions: mentionsData}
}))
  const title = screen.queryByTestId('software-mentions-section-title')
  expect(title).toBeInTheDocument()
  // screen.debug()
})

it('should render featured mention items (based on dummy data)',()=>{
  render(WrappedComponentWithProps(MentionsSection, {
    props: {mentions: mentionsData}
  }))
  const expectedItems = mentionsData.filter(item=>item.is_featured)
  const featured = screen.queryAllByTestId('mention-is-featured')
  expect(featured.length).toEqual(expectedItems.length)
  // screen.debug()
})

it('should render 15 mention type sections (based on dummy data)',()=>{
  render(WrappedComponentWithProps(MentionsSection, {
    props: {mentions: mentionsData}
  }))
  const mentions = screen.queryAllByTestId('mentions-section-for-type')
  expect(mentions.length).toEqual(15)
  // screen.debug()
})

it('should render all not featured mention items (based on dummy data)',()=>{
  render(WrappedComponentWithProps(MentionsSection, {
    props: {mentions: mentionsData}
  }))
  const expectedItems = mentionsData.filter(item=>!item.is_featured)
  const mentionItems = screen.queryAllByTestId('mention-view-item-body')
  expect(mentionItems.length).toEqual(expectedItems.length)
  // screen.debug()
})
