import {render,screen,fireEvent,waitFor} from '@testing-library/react'
import {WrappedComponentWithProps,WrappedComponentWithPropsAndSession} from '../../../utils/jest/WrappedComponents'

import AddSoftwareCard from './AddSoftwareCard'
import {addConfig} from './addConfig'
import {getSlugFromString} from '../../../utils/getSlugFromString'

// mock addSoftware
import * as editSoftware from '../../../utils/editSoftware'
const mockAddSoftware = jest.spyOn(editSoftware, 'addSoftware')
  .mockImplementation((props)=>Promise.resolve({status:201,message:props}))

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
  // screen.debug()
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

// Further investigation needed why mocking is not working
it('saves and redirects with proper params', async () => {
  // render
  render(WrappedComponentWithPropsAndSession({
    Component: AddSoftwareCard,
    session: {
      user: null,
      token: 'TEST_TOKEN',
      status: 'authenticated'
    }
  }))

  const name = screen.getByRole('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  const desc = screen.getByRole('textbox', {name: 'Short description'})
  expect(desc).toBeInTheDocument()

  // accepts test values
  const inputName = 'Test software name'
  fireEvent.change(name, {target: {value: inputName}})
  const inputValue = 'Test software description'
  fireEvent.change(desc, {target: {value: inputValue}})

  // select button
  const save = screen.getByRole('button', {name: 'Save'})
  expect(save).toBeInTheDocument()
  await fireEvent.submit(save)

  await waitFor(() => {
    const slug = getSlugFromString(inputName)
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

// Further investigation needed why mocking is not working
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
