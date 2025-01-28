// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {RsdUser, Session} from './index'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import ProtectedContent from './ProtectedContent'

// MOCKS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const softwareMaintainer=jest.fn((props)=>Promise.resolve(false))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const projectMaintainer=jest.fn((props)=>Promise.resolve(false))
jest.mock('./permissions/isMaintainerOfSoftware', () => {
  // console.log('mocked isMaintainerOfSoftware')
  return {
    isMaintainerOfSoftware:jest.fn((props)=>softwareMaintainer(props))
  }
})

jest.mock('./permissions/isMaintainerOfProject', () => {
  // console.log('mocked isMaintainerOfProject')
  return {
    isMaintainerOfProject:jest.fn((props)=>projectMaintainer(props))
  }
})

const session:Session = {
  user: null,
  token: 'TEST_TOKEN',
  status: 'loading'
}

const mockUser:RsdUser={
  iss: 'rsd_auth',
  role: 'rsd_user',
  exp: 1212121212,
  account: 'test-account-string',
  name: 'John Doe'
}

it('renders loader when status loader', () => {
  session.status = 'loading'
  render(WrappedComponentWithProps(ProtectedContent,{
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
  render(WrappedComponentWithProps(Content,{
    session
  }))
  const header = await screen.findByText('Authenticated')
  expect(header).toBeInTheDocument()
})

it('renders 401 when no token for all pages', async() => {
  session.status = 'missing'
  const Content = () => (
    <ProtectedContent slug="/software">
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithProps(Content,{
    session
  }))
  const b403 = await screen.findByText('401')
  expect(b403).toBeInTheDocument()
})

it('renders 401 when no token for edit software', async() => {
  session.status = 'missing'
  const Content = () => (
    <ProtectedContent slug="/test-software-1" pageType='software'>
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithProps(Content,{
    session
  }))
  const b403 = await screen.findByText('401')
  expect(b403).toBeInTheDocument()
})

it('renders 401 when no token for edit project', async() => {
  session.status = 'missing'
  const Content = () => (
    <ProtectedContent slug="/test-project-1" pageType='project'>
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithProps(Content,{
    session
  }))
  const b403 = await screen.findByText('401')
  expect(b403).toBeInTheDocument()
})

it('renders 403 when no maintainer', async() => {
  session.status = 'authenticated'
  const Content = () => (
    <ProtectedContent slug="/maintainer">
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithProps(Content,{
    session
  }))
  const b403 = await screen.findByText('403')
  expect(b403).toBeInTheDocument()
})

it('renders content of type software when maintainer', async () => {
  // send required props
  session.status = 'authenticated'
  session.token = 'TEST_RANDOM_TOKEN'
  session.user = mockUser
  // mock isMaintainerOfSoftware response to true
  softwareMaintainer.mockResolvedValueOnce(true)
  const Content = () => (
    <ProtectedContent slug="/test-software-1" pageType='software'>
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithProps(Content,{
    session
  }))

  const content = await screen.findByText('Authenticated')
  expect(content).toBeInTheDocument()

  // ensure isMaintainerOfSoftware is called
  expect(softwareMaintainer).toHaveBeenCalledTimes(1)
  // with expected agrguments
  expect(softwareMaintainer).toHaveBeenCalledWith({
    'account': 'test-account-string',
    'slug': '/test-software-1',
    'token': 'TEST_RANDOM_TOKEN',
  })
})

it('renders content of type project when maintainer', async () => {
  // send required props
  session.status = 'authenticated'
  session.token = 'TEST_RANDOM_TOKEN'
  session.user = {
    iss: 'rsd_auth',
    role: 'rsd_user',
    exp: 1212121212,
    account: 'test-account-string',
    name: 'John Doe'
  }
  // mock isMaintainerOfProject response to true
  projectMaintainer.mockResolvedValueOnce(true)
  const Content = () => (
    <ProtectedContent slug="/test-project-1" pageType='project'>
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithProps(Content,{
    session
  }))

  const content = await screen.findByText('Authenticated')
  expect(content).toBeInTheDocument()

  // ensure isMaintainerOfProject is called
  expect(projectMaintainer).toHaveBeenCalledTimes(1)
  // with expected agrguments
  expect(projectMaintainer).toHaveBeenCalledWith({
    'account': 'test-account-string',
    'slug': '/test-project-1',
    'token': 'TEST_RANDOM_TOKEN',
  })
})
