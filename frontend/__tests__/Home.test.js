import {render, screen} from '@testing-library/react'
import Home from '../pages/index'

import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

describe('pages/index.tsx', () => {
  beforeEach(()=>{
    // fetch.mockResponse(JSON.stringify([]))
    render(WrappedComponentWithProps(Home))
  })
  it('renders heading with Home page title', () => {
    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
    expect(heading.innerHTML).toEqual("Home page")
  })
})