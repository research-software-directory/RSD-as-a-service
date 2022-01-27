import {render,screen,fireEvent,waitFor} from '@testing-library/react'
import {WrappedComponentWithProps} from '../../../utils/jest/WrappedComponents'

import AddSoftwareModal from './AddSoftwareModal'
import {addSoftware} from '../../../utils/editSoftware'

jest.mock('../../../utils/editSoftware')

it('DOES NOT render modal with Add software title if no session', async () => {
  render(WrappedComponentWithProps(AddSoftwareModal))
  const title = await screen.queryByText('Add software')
  expect(title).not.toBeInTheDocument()
})

it('render modal with "Add software" title if session', async () => {
  render(WrappedComponentWithProps(AddSoftwareModal,{action:'open'}, {
    user: 'Test user',
    token: 'TEST-TOKEN',
    status:'authenticated'
  }))
  const title = await screen.queryByText('Add software')
  expect(title).toBeInTheDocument()
  // screen.debug()
})

it('modal has textbox with Name that can be entered', async() => {
  render(WrappedComponentWithProps(AddSoftwareModal,{action:'open'}, {
    user: 'Test user',
    token: 'TEST-TOKEN',
    status:'authenticated'
  }))
  const name = screen.getByRole('textbox', {name: 'Name'})
  expect(name).toBeInTheDocument()

  // accepts test value
  const inputValue = 'Test software name'
  fireEvent.change(name, {target: {value: inputValue}})
  expect(name.value).toEqual(inputValue)
})

it('modal has textbox with Short description that can be entered', async() => {
  render(WrappedComponentWithProps(AddSoftwareModal,{action:'open'}, {
    user: 'Test user',
    token: 'TEST-TOKEN',
    status:'authenticated'
  }))
  const desc = screen.getByRole('textbox', {name: 'Short description'})
  expect(desc).toBeInTheDocument()

  // accepts test value
  const inputValue = 'Test software description'
  fireEvent.change(desc, {target: {value: inputValue}})
  expect(desc.value).toEqual(inputValue)
})

// TODO! cannot mock addSoftware method?!?
// Further investigation needed why mocking is not working
// eslint-disable-next-line jest/no-commented-out-tests
// it.skip('calls addSoftware with proper params', async() => {
//   render(WrappedComponentWithProps(AddSoftwareModal,{action:'open'}, {
//     user: 'Test user',
//     token: 'TEST-TOKEN',
//     status:'authenticated'
//   }))

//   // console.log('addSoftware...',JSON.stringify(addSoftware))

//   const name = screen.getByRole('textbox', {name: 'Name'})
//   expect(name).toBeInTheDocument()

//   const desc = screen.getByRole('textbox', {name: 'Short description'})
//   expect(desc).toBeInTheDocument()

//   // accepts test values
//   const inputName = 'Test software name'
//   fireEvent.change(name, {target: {value: inputName}})
//   const inputValue = 'Test software description'
//   fireEvent.change(desc, {target: {value: inputValue}})

//   // select button
//   const save = screen.getByRole('button', {name: 'Save'})
//   expect(save).toBeInTheDocument()

//   await fireEvent.submit(save)

//   await waitFor(() => {
//     // screen.debug(save)
//     expect(addSoftware).toHaveBeenCalledTimes(1)
//   })
// })


