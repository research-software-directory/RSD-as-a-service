import {render,screen} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../utils/jest/WrappedComponents'
import AppFooter from './AppFooter'

it('should render footer with role contentinfo',()=>{
  render(WrappedComponentWithProps(AppFooter))
  const footer = screen.getByRole('contentinfo')
  expect(footer).toBeInTheDocument()
})
