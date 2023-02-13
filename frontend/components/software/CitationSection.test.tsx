// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'

import CitationSection from './CitationSection'
import releases from './__mocks__/softwareReleases.json'


it('should NOT render citation section when no data provided',()=>{
  render(WrappedComponentWithProps(CitationSection))
  const title = screen.queryByTestId('citation-section-title')
  expect(title).not.toBeInTheDocument()
  // screen.debug()
})

describe('with dummy data',()=>{
  beforeEach(()=>{
    // render citation section with parent context and dummy data
    render(WrappedComponentWithProps(CitationSection, {
      props: {releases}
    }))
  })

  it('should render citation section with title: Cite this software',()=>{
    // get title
    const title = screen.getByTestId('citation-section-title')
    // assert
    expect(title).toBeInTheDocument()
    expect(title.innerHTML).toEqual('Cite this software')
  })

  it('should render first release doi',()=>{
    // get doi from dummy data
    const firstDoi = releases[0].doi
    // find it
    const doi = screen.getByText(firstDoi)
    // assert
    expect(doi).toBeInTheDocument()
  })

  it('should have 2 dropdowns: version and citation format',()=>{
    // get dropdowns
    const dropwdowns = screen.getAllByTestId('cite-dropdown')
    // assert 2 dropdowns
    expect(dropwdowns.length).toEqual(2)
  })

  it('should have "Copy DOI" button',()=>{
    // find it
    const copyButton = screen.getByRole('button',{
      name:'Copy DOI'
    })
    // assert
    expect(copyButton).toBeInTheDocument()
  })

  it('should have "Download citation" button initialy disabled',()=>{
    // find it
    const downloadButton = screen.getByRole('button',{
      name:'Download citation'
    })
    // assert
    // it exists
    expect(downloadButton).toBeInTheDocument()
    // is disableed
    expect(downloadButton).toHaveAttribute('disabled')
  })
})
