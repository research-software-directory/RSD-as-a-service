// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import SoftwareItemPage from '../pages/software/[slug]/index'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

// mock fetch response
import softwareIndexData from './__fixtures__/softwareIndexData'

jest.mock('../utils/getSoftware')

describe('pages/software/[slug]/index.tsx', () => {
  it('renders heading with software title', async() => {
    render(WrappedComponentWithProps(
      SoftwareItemPage,
      {props: softwareIndexData}
    ))
    const title = await screen.findByText(softwareIndexData.software.brand_name)
    expect(title).toBeInTheDocument()
    // screen.debug()
  })
  it('renders edit button when isMaintainer=true', () => {
    // set isMaintainer to true
    softwareIndexData.isMaintainer=true
    render(WrappedComponentWithProps(
      SoftwareItemPage,
      {props: softwareIndexData}
    ))
    const editBtn = screen.getByTestId('edit-button')
    expect(editBtn).toBeInTheDocument()
    // screen.debug(editBtn)
  })
  it('DOES NOT render edit button when isMaintainer=false', () => {
    // set isMaintainer to true
    softwareIndexData.isMaintainer=false
    render(WrappedComponentWithProps(
      SoftwareItemPage,
      {props: softwareIndexData}
    ))
    const editBtn = screen.queryByTestId('edit-button')
    expect(editBtn).not.toBeInTheDocument()
    // screen.debug(editBtn)
  })
  it('render mentions count', () => {
    render(WrappedComponentWithProps(
      SoftwareItemPage,
      {props: softwareIndexData}
    ))
    const expected = softwareIndexData.softwareIntroCounts.mention_cnt
    const mentions = screen.getByText(expected)
    expect(mentions).toBeInTheDocument()
    // screen.debug(editBtn)
  })
  it('render contributor_cnt count', () => {
    render(WrappedComponentWithProps(
      SoftwareItemPage,
      {props: softwareIndexData}
    ))
    const expected = softwareIndexData.softwareIntroCounts.contributor_cnt
    const contributor_cnt = screen.getByText(expected)
    expect(contributor_cnt).toBeInTheDocument()
    // screen.debug(editBtn)
  })
})
