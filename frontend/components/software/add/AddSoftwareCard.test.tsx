// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen,fireEvent,waitFor,waitForElementToBeRemoved,act} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../../utils/jest/WrappedComponents'

import {Session} from '../../../auth/'
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

it('render card with title', async () => {
  render(WrappedComponentWithProps(AddSoftwareCard))
  const title = await screen.queryByText(addConfig.title)
  await act(() => {
    expect(title).toBeInTheDocument()
  })
})

it('card has textbox with Name that can be entered', async() => {
  render(WrappedComponentWithProps(AddSoftwareCard))
  const name = screen.getByRole<HTMLInputElement>('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  // accepts test value
  const inputValue = 'Test software name'
  fireEvent.change(name, {target: {value: inputValue}})
  await act(() => {
    expect(name.value).toEqual(inputValue)
  })
})

it('card has textbox with Short description that can be entered', async() => {
  render(WrappedComponentWithProps(AddSoftwareCard))
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
  render(WrappedComponentWithProps(AddSoftwareCard))
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
  render(WrappedComponentWithProps(AddSoftwareCard))
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
  const session:Session = {
    user: null,
    token: 'TEST_TOKEN',
    status: 'authenticated'
  }
  const slug = getSlugFromString(inputName)
  // render
  render(WrappedComponentWithProps(AddSoftwareCard,{
    session
  }))

  const name = screen.getByRole<HTMLInputElement>('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  const desc = screen.getByRole<HTMLInputElement>('textbox', {name: 'Short description'})
  expect(desc).toBeInTheDocument()

  // const slugInput = screen.getByRole<HTMLInputElement>('textbox', {name: 'The url of this software will be'})
  // expect(desc).toBeInTheDocument()

  fireEvent.change(name, {target: {value: inputName}})
  fireEvent.change(desc, {target: {value: inputValue}})

  // confirm slug validation in progress
  // we mock validSoftwareItem and wait for 100ms
  const loader = await screen.findByTestId('slug-circular-progress')
  expect(loader).toBeInTheDocument()
  // confirm that loader is removed
  await waitForElementToBeRemoved(loader)

  // validate slug
  expect(mockValidSoftwareItem).toHaveBeenCalledTimes(1)
  expect(mockValidSoftwareItem).toHaveBeenCalledWith(slug, session.token)
  // })

  // save
  const save = screen.getByRole('button', {name: 'Save'})
  expect(save).toBeInTheDocument()
  expect(name.value).toEqual(inputName)
  // expect(desc.value).toEqual(inputValue)

  // submit button
  fireEvent.submit(save)

  await waitFor(() => {
    // calling add software
    expect(mockAddSoftware).toHaveBeenCalledTimes(1)
    expect(mockAddSoftware).toHaveBeenCalledWith({
      'software':{
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
