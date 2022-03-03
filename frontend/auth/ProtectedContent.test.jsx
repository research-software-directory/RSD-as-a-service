
import {render,screen} from '@testing-library/react'
import {WrappedComponentWithPropsAndSession} from '../utils/jest/WrappedComponents'

import ProtectedContent from './ProtectedContent'

const session = {
  user: null,
  token: 'TEST_TOKEN',
  status: 'loading'
}

it('renders loader when status loader', () => {
  session.status = 'loading'
  render(WrappedComponentWithPropsAndSession({
    Component: ProtectedContent,
    session
  }))
  const loader = screen.getByRole('progressbar')
  expect(loader).toBeInTheDocument()
})

it('renders content when authenticated', async() => {
  session.status = 'authenticated'
  const Content = () => (
    <ProtectedContent>
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithPropsAndSession({
    Component: Content,
    session
  }))
  const header = await screen.findByText('Authenticated')
  expect(header).toBeInTheDocument()
})

it('renders 403 when no maintainer', async() => {
  session.status = 'authenticated'
  const Content = () => (
    <ProtectedContent slug="/maintainer">
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithPropsAndSession({
    Component: Content,
    session
  }))
  const b403 = await screen.findByText('403')
  expect(b403).toBeInTheDocument()
})


