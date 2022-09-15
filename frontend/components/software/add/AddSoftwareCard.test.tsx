// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen,fireEvent,waitFor,waitForElementToBeRemoved} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../../utils/jest/WrappedComponents'

import {Session} from '../../../auth/'
import AddSoftwareCard from './AddSoftwareCard'
import {addConfig} from './addConfig'
import {getSlugFromString} from '../../../utils/getSlugFromString'

// mock addSoftware
import * as editSoftware from '../../../utils/editSoftware'

// mock addSoftware
const mockAddSoftware = jest.spyOn(editSoftware, 'addSoftware')
  .mockImplementation((props) => Promise.resolve({status: 201, message: props}))

// mock validSoftwareItem
const mockValidSoftwareItem = jest.spyOn(editSoftware, 'validSoftwareItem')
  .mockImplementation((props) => new Promise((res, rej) => {
    setTimeout(() => {
      res(false)
    },100)
  }))

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
  expect(title).toBeInTheDocument()
})

it('card has textbox with Name that can be entered', () => {
  render(WrappedComponentWithProps(AddSoftwareCard))
  const name = screen.getByRole<HTMLInputElement>('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  // accepts test value
  const inputValue = 'Test software name'
  fireEvent.change(name, {target: {value: inputValue}})
  expect(name.value).toEqual(inputValue)
})

it('card has textbox with Short description that can be entered', () => {
  render(WrappedComponentWithProps(AddSoftwareCard))
  const desc = screen.getByRole<HTMLInputElement>('textbox', {name: 'Short description'})
  expect(desc).toBeInTheDocument()
  // accepts test value
  const inputValue = 'Test software description'
  fireEvent.change(desc, {target: {value: inputValue}})
  expect(desc.value).toEqual(inputValue)
})

it('card has cancel and submit buttons', () => {
  render(WrappedComponentWithProps(AddSoftwareCard))
  const submit = screen.getByRole('button',{name:'Save'})
  expect(submit).toBeInTheDocument()
  // accepts test value
  const cancel = screen.getByRole('button', {name: 'Cancel'})
  expect(cancel).toBeInTheDocument()
})

it('goes back on cancel', () => {
  // render
  render(WrappedComponentWithProps(AddSoftwareCard))
  // accepts test value
  const cancel = screen.getByRole('button', {name: 'Cancel'})
  expect(cancel).toBeInTheDocument()
  // click op cancel
  fireEvent.click(cancel)
  // assert that router back is called
  expect(mockBack).toHaveBeenCalledTimes(1)
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

  fireEvent.change(name, {target: {value: inputName}})
  fireEvent.change(desc, {target: {value: inputValue}})

  // confirm slug validation in progress
  // we mock validSoftwareItem and wait for 100ms
  const loader = await screen.findByTestId('slug-circular-progress')
  expect(loader).toBeInTheDocument()
  // confirm that loader is removed
  await waitForElementToBeRemoved(loader)

  // save
  const save = screen.getByRole('button', {name: 'Save'})
  expect(save).toBeInTheDocument()
  expect(name.value).toEqual(inputName)
  expect(desc.value).toEqual(inputValue)

  // submit button
  fireEvent.submit(save)

  await waitFor(() => {
    // validate slug
    expect(mockValidSoftwareItem).toHaveBeenCalledTimes(1)
    expect(mockValidSoftwareItem).toHaveBeenCalledWith(slug, session.token)
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
