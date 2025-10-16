// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen,fireEvent,waitFor,act, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AddSoftwareCard from './AddSoftwareCard'
import {addConfig} from './addConfig'
import {getSlugFromString} from '../../../utils/getSlugFromString'

const mockAddSoftware = jest.fn((props)=>Promise.resolve({status: 201, message: props}))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockValidSoftwareItem = jest.fn((slug,token) => {
  // console.log('validProjectItem...props...',slug,token)
  return new Promise((res) => {
    setTimeout(() => {
      res(false)
    }, 10)
  })
})

jest.mock('~/components/software/edit/apiEditSoftware', () => {
  return {
    addSoftware: jest.fn((props)=> mockAddSoftware(props)),
    validSoftwareItem: jest.fn((slug,token)=> mockValidSoftwareItem(slug,token))
  }
})

// mock next router
const mockBack = jest.fn()
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace
  })
}))

// USE FAKE TIMERS
jest.useFakeTimers()
// CLEAR ALL MOCKS before each test
beforeEach(() => {
  jest.clearAllMocks()
})
// CLEAR all pending timers
afterEach(() => {
  jest.runOnlyPendingTimers()
})

it('render card with title', async () => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AddSoftwareCard />
    </WithAppContext>
  )
  const title = await screen.queryByText(addConfig.title)
  await act(() => {
    expect(title).toBeInTheDocument()
  })
})

it('card has textbox with Name that can be entered', async() => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AddSoftwareCard />
    </WithAppContext>
  )
  const name = screen.getByRole<HTMLInputElement>('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  // accepts test value
  const inputValue = 'Test software name'
  fireEvent.change(name, {target: {value: inputValue}})
  // validate
  expect(name.value).toEqual(inputValue)
})

it('card has textbox with Short description that can be entered', async() => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AddSoftwareCard />
    </WithAppContext>
  )
  const desc = screen.getByRole<HTMLInputElement>('textbox', {name: 'Short description'})
  expect(desc).toBeInTheDocument()
  // accepts test value
  const inputValue = 'Test software description'
  fireEvent.change(desc, {target: {value: inputValue}})
  await act(() => {
    expect(desc.value).toEqual(inputValue)
  })
})

it('card has cancel and submit buttons', async() => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AddSoftwareCard />
    </WithAppContext>
  )
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
  render(
    <WithAppContext options={{session:mockSession}}>
      <AddSoftwareCard />
    </WithAppContext>
  )
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
  const inputName = 'Test software name'
  const inputValue = 'Test software description'
  const slug = getSlugFromString(inputName)
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <AddSoftwareCard />
    </WithAppContext>
  )

  const name = screen.getByRole<HTMLInputElement>('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  const desc = screen.getByRole<HTMLInputElement>('textbox', {name: 'Short description'})
  expect(desc).toBeInTheDocument()

  // input name and description
  fireEvent.change(name, {target: {value: inputName}})
  fireEvent.change(desc, {target: {value: inputValue}})

  // confirm slug validation in progress
  const loader = await screen.findByTestId('slug-circular-progress')
  expect(loader).toBeInTheDocument()
  // confirm that loader is removed
  await waitForElementToBeRemoved(loader)

  // validate slug
  await waitFor(() => {
    expect(mockValidSoftwareItem).toHaveBeenCalledTimes(1)
    expect(mockValidSoftwareItem).toHaveBeenCalledWith(slug, mockSession.token)
  })

  // save
  const save = screen.getByRole('button', {name: 'Save'})
  expect(save).toBeInTheDocument()
  expect(name.value).toEqual(inputName)
  expect(desc.value).toEqual(inputValue)
  expect(save).toBeEnabled()
  // submit button
  fireEvent.submit(save)

  await waitFor(() => {
    // calling add software
    expect(mockAddSoftware).toHaveBeenCalledTimes(1)
    expect(mockAddSoftware).toHaveBeenCalledWith({
      'software': {
        'brand_name': inputName,
        'concept_doi': null,
        'description': null,
        'description_type': 'markdown',
        'description_url': null,
        'get_started_url': null,
        'is_published': false,
        'short_statement': inputValue,
        'slug': slug,
        'image_id': null
      },
      'token': 'TEST_TOKEN',
    })
    // calling redirect
    expect(mockReplace).toHaveBeenCalledTimes(1)
    // with proper url
    const expected = `/software/${slug}/edit`
    expect(mockReplace).toHaveBeenCalledWith(expected)
  })
})
