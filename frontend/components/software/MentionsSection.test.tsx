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
  render(WrappedComponentWithProps(MentionsSection, {mentions: mentionsData}))
  const title = screen.queryByTestId('software-mentions-section-title')
  expect(title).toBeInTheDocument()
  // screen.debug()
})

it('should render featured mention items (based on dummy data)',()=>{
  render(WrappedComponentWithProps(MentionsSection, {mentions: mentionsData}))
  const expectedItems = mentionsData.filter(item=>item.is_featured)
  const featured = screen.queryAllByTestId('software-mention-is-featured')
  expect(featured.length).toEqual(expectedItems.length)
  // screen.debug()
})

it('should render 6 mention type sections (based on dummy data)',()=>{
  render(WrappedComponentWithProps(MentionsSection, {mentions:mentionsData}))
  const mentions = screen.queryAllByTestId('software-mentions-by-type')
  expect(mentions.length).toEqual(6)
  // screen.debug()
})

it('should render all not featured mention items (based on dummy data)',()=>{
  render(WrappedComponentWithProps(MentionsSection, {mentions: mentionsData}))
  const expectedItems = mentionsData.filter(item=>!item.is_featured)
  const mentionItems = screen.queryAllByTestId('software-mention-item-body')
  expect(mentionItems.length).toEqual(expectedItems.length)
  // screen.debug()
})
