// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen,fireEvent,waitFor,waitForElementToBeRemoved,act} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../../utils/jest/WrappedComponents'

import {Session} from '../../../auth'
import AddProjectCard from './AddProjectCard'
import {addConfig} from './addProjectConfig'
import {getSlugFromString} from '../../../utils/getSlugFromString'

const mockAddProject = jest.fn((props)=>Promise.resolve({status: 201, message: props}))
const mockValidProjectItem = jest.fn((slug,token) => {
  // console.log('validProjectItem...props...',slug,token)
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(false)
    }, 10)
  })
})

jest.mock('~/utils/editProject', () => {
  return {
    addProject: jest.fn((props)=> mockAddProject(props)),
    validProjectItem: jest.fn((slug,token)=> mockValidProjectItem(slug,token))
  }
})

// mock next router
const mockBack = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace
  })
}))

// prepare
jest.useFakeTimers()

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.clearAllMocks()
})

it('render card with title, subtitle and slug', () => {
  render(WrappedComponentWithProps(AddProjectCard))

  const title = screen.getByRole('textbox', {name: addConfig.project_title.label})
  const subtitle = screen.getByRole('textbox', {name: addConfig.project_subtitle.label})
  const slug = screen.getByRole('textbox',{name: addConfig.project_subtitle.label})

  expect(title).toBeInTheDocument()
  expect(subtitle).toBeInTheDocument()
  expect(slug).toBeInTheDocument()
})

it('card has textbox with Title that can be entered', async() => {

  render(WrappedComponentWithProps(AddProjectCard))
  // check title
  const title:HTMLInputElement = screen.getByRole('textbox', {name: addConfig.project_title.label})
  expect(title).toBeInTheDocument()

  // dummy input value
  const inputTitle = 'Test project title'
  act(() => {
    // accepts test value
    fireEvent.change(title, {target: {value: inputTitle}})
    jest.runAllTimers()
  })

  // confirm slug validation in progress
  // REQUIRED! to avoid act warning/error shown
  const loader = await screen.findByTestId('slug-circular-progress')
  expect(loader).toBeInTheDocument()
  // confirm that loader is removed
  await waitForElementToBeRemoved(loader)

  // validate value
  expect(title.value).toEqual(inputTitle)
})

it('card has cancel and submit buttons', async() => {
  render(WrappedComponentWithProps(AddProjectCard))
  const submit = screen.getByRole('button',{name:'Save'})
  expect(submit).toBeInTheDocument()
  // accepts test value
  const cancel = screen.getByRole('button', {name: 'Cancel'})
  await act(() => {
    expect(cancel).toBeInTheDocument()
  })
})

it('goes back on cancel', async() => {
  // render
  render(WrappedComponentWithProps(AddProjectCard))
  // accepts test value
  const cancel = screen.getByRole('button', {name: 'Cancel'})
  expect(cancel).toBeInTheDocument()
  // click op cancel
  fireEvent.click(cancel)
  await act(() => {
    // assert that router back is called
    expect(mockBack).toHaveBeenCalledTimes(1)
  })
})

it('validate, save and redirect', async () => {
  // test values
  const inputTitle = 'Test project title'
  const inputSubtitle = 'Test project subtitle'
  const session:Session = {
    user: null,
    token: 'TEST_TOKEN',
    status: 'authenticated'
  }
  const slug = getSlugFromString(inputTitle)

  // render
  render(WrappedComponentWithProps(AddProjectCard,{
    session
  }))

  const title = screen.getByRole<HTMLInputElement>('textbox', {name: 'Title'})
  expect(title).toBeInTheDocument()

  const desc = screen.getByRole<HTMLInputElement>('textbox', {name: 'Subtitle'})
  expect(desc).toBeInTheDocument()

  fireEvent.change(title, {target: {value: inputTitle}})
  fireEvent.change(desc, {target: {value: inputSubtitle}})

  // confirm slug validation in progress
  const loader = await screen.findByTestId('slug-circular-progress')
  expect(loader).toBeInTheDocument()
  // confirm that loader is removed
  await waitForElementToBeRemoved(loader)

  // save
  const save = screen.getByRole('button', {name: 'Save'})
  // validate
  expect(save).toBeInTheDocument()
  expect(title.value).toEqual(inputTitle)
  expect(desc.value).toEqual(inputSubtitle)

  // submit button
  fireEvent.submit(save)

  await waitFor(() => {
    // validate slug
    expect(mockValidProjectItem).toHaveBeenCalledTimes(1)
    expect(mockValidProjectItem).toHaveBeenCalledWith(slug, session.token)
    // calling add software
    expect(mockAddProject).toHaveBeenCalledTimes(1)
    expect(mockAddProject).toHaveBeenCalledWith({
      'project':{
        slug: slug,
        title: inputTitle,
        is_published: false,
        subtitle: inputSubtitle,
        description: null,
        date_start: null,
        date_end: null,
        image_caption: null,
        image_contain: false,
        grant_id: null
      },
      'token': 'TEST_TOKEN',
    })
    // calling redirect
    expect(mockReplace).toHaveBeenCalledTimes(1)
    // with proper url
    const expected = `/projects/${slug}/edit`
    expect(mockReplace).toHaveBeenCalledWith(expected)
  })
})
