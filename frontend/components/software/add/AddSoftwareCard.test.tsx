// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen,fireEvent,waitFor,act, waitForElementToBeRemoved} from '@testing-library/react'
import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'

import AddSoftwareCard from './AddSoftwareCard'
import {addConfig} from './addConfig'
import {getSlugFromString} from '../../../utils/getSlugFromString'

const mockAddSoftware = jest.fn((props)=>Promise.resolve({status: 201, message: props}))
const mockValidSoftwareItem = jest.fn((slug,token) => {
  // console.log('validProjectItem...props...',slug,token)
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(false)
    }, 10)
  })
})

jest.mock('~/utils/editSoftware', () => {
  return {
    addSoftware: jest.fn((props)=> mockAddSoftware(props)),
    validSoftwareItem: jest.fn((slug,token)=> mockValidSoftwareItem(slug,token))
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
  // await act(() => {
  //   expect(title).toBeInTheDocument()
  // })
})

it('card has textbox with Name that can be entered', async() => {
  render(
    <WithAppContext options={{session:mockSession}}>
      <AddSoftwareCard />
    </WithAppContext>
  )
  const name = screen.getByRole<HTMLInputElement>('textbox', {name: 'Name'})
  // expect(name).toBeInTheDocument()

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
  // expect(desc).toBeInTheDocument()
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
  screen.getByRole('button',{name:'Save'})
  // expect(submit).toBeInTheDocument()
  // accepts test value
  screen.getByRole('button', {name: 'Cancel'})
  // await act(() => {
  //   expect(cancel).toBeInTheDocument()
  // })
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
  // mock response
  mockValidSoftwareItem.mockResolvedValueOnce(false)
  // render
  render(
    <WithAppContext options={{session: mockSession}}>
      <AddSoftwareCard />
    </WithAppContext>
  )

  const openSource = screen.getByRole('radio',{name:'Open source software'})
  const name = screen.getByRole<HTMLInputElement>('textbox', {name: 'Name'})
  const desc = screen.getByRole<HTMLInputElement>('textbox', {name: 'Short description'})

  // open source, input name and description
  fireEvent.click(openSource)
  fireEvent.change(name, {target: {value: inputName}})
  fireEvent.change(desc, {target: {value: inputValue}})

  // check slug validation is called
  await waitFor(() => {
    expect(mockValidSoftwareItem).toHaveBeenCalledTimes(1)
    expect(mockValidSoftwareItem).toHaveBeenCalledWith(slug, mockSession.token)
  })

  // save
  const save = screen.getByRole('button', {name: 'Save'})
  expect(name.value).toEqual(inputName)
  expect(desc.value).toEqual(inputValue)
  await waitFor(()=>{
    expect(save).toBeEnabled()
  })

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
        'open_source': true,
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
