import {render,screen,fireEvent,waitFor,waitForElementToBeRemoved} from '@testing-library/react'
import {WrappedComponentWithProps,WrappedComponentWithPropsAndSession} from '../../../utils/jest/WrappedComponents'

import AddSoftwareCard from './AddSoftwareCard'
import {addConfig} from './addConfig'
import {getSlugFromString} from '../../../utils/getSlugFromString'

// mock addSoftware
import * as editSoftware from '../../../utils/editSoftware'
const mockAddSoftware = jest.spyOn(editSoftware, 'addSoftware')
  .mockImplementation((props) => Promise.resolve({status: 201, message: props}))
// mock validSoftwareItem
const mockValidSoftwareItem = jest.spyOn(editSoftware, 'validSoftwareItem')
  .mockImplementation((props) => new Promise((res, rej) => {
    setTimeout(() => {
      res(false)
    },1)
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

it('card has textbox with Name that can be entered', async() => {
  render(WrappedComponentWithProps(AddSoftwareCard))
  const name = screen.getByRole('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  // accepts test value
  const inputValue = 'Test software name'
  fireEvent.change(name, {target: {value: inputValue}})
  expect(name.value).toEqual(inputValue)
})

it('card has textbox with Short description that can be entered', async() => {
  render(WrappedComponentWithProps(AddSoftwareCard))
  const desc = screen.getByRole('textbox', {name: 'Short description'})
  expect(desc).toBeInTheDocument()
  // accepts test value
  const inputValue = 'Test software description'
  fireEvent.change(desc, {target: {value: inputValue}})
  expect(desc.value).toEqual(inputValue)
})

it('card has cancel and submit buttons', async() => {
  render(WrappedComponentWithProps(AddSoftwareCard))
  const submit = screen.getByRole('button',{name:'Save'})
  expect(submit).toBeInTheDocument()
  // accepts test value
  const cancel = screen.getByRole('button', {name: 'Cancel'})
  expect(cancel).toBeInTheDocument()
})

it('goes back on cancel', async () => {
  // render
  render(WrappedComponentWithProps(AddSoftwareCard))
  // accepts test value
  const cancel = screen.getByRole('button', {name: 'Cancel'})
  expect(cancel).toBeInTheDocument()
  // click op cancel
  await fireEvent.click(cancel)
  // assert that router back is called
  expect(mockBack).toHaveBeenCalledTimes(1)
})

it('validate, save and redirect', async () => {
  // test values
  const inputName = 'Test software name'
  const inputValue = 'Test software description'
  const session = {
    user: null,
    token: 'TEST_TOKEN',
    status: 'authenticated'
  }
  // render
  render(WrappedComponentWithPropsAndSession({
    Component: AddSoftwareCard,
    session
  }))

  const name = screen.getByRole('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  const desc = screen.getByRole('textbox', {name: 'Short description'})
  expect(desc).toBeInTheDocument()

  fireEvent.change(name, {target: {value: inputName}})
  fireEvent.change(desc, {target: {value: inputValue}})

  // confirm slug validation in progress
  const loader = await screen.findByTestId('slug-circular-progress')
  expect(loader).toBeInTheDocument()
  // confirm that loader is removed
  await waitForElementToBeRemoved(loader)

  // save
  const save = screen.getByRole('button', {name: 'Save'})
  await waitFor(async () => {
    expect(name.value).toEqual(inputName)
    expect(desc.value).toEqual(inputValue)
    expect(save).toBeInTheDocument()
  })

  // submit button
  await fireEvent.submit(save)

  await waitFor(() => {
    const slug = getSlugFromString(inputName)
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
        'is_featured': false,
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

