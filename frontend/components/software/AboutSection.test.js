import {render,screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'

import AboutSection from './AboutSection'
import softwareItemInfo from './__fixtures__/softwareItemInfo.json'

it('should NOT render about section when brand_name NOT provided',()=>{
  render(WrappedComponentWithProps(AboutSection))
  const title = screen.queryByTestId('about-statement-title')
  expect(title).not.toBeInTheDocument()
  // screen.debug()
})

describe('with __mocked__ data', () => {
  beforeEach(() => {
    // render about section with parent context and dummy data
    render(WrappedComponentWithProps(AboutSection, softwareItemInfo))
  })

  it('should render AboutStatement title', () => {
    const expectedTitle = `What ${softwareItemInfo.brand_name} can do for you`
    const title = screen.getByText(expectedTitle)
    expect(title).toBeInTheDocument()
  })

  it('should render 4 bullets at AboutStatement', () => {
    const bullets = screen.getAllByTestId('about-bullet-item')
    expect(bullets.length).toEqual(4)
  })

  it('should render AboutReadMore component', () => {
    const readmore = screen.getByTestId('about-read-more-section')
    expect(readmore).toBeInTheDocument()
  })

  it('should render No tags avaliable', () => {
    const noTags = screen.getByText('No tags avaliable')
    expect(noTags).toBeInTheDocument()
  })

})
