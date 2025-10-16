// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within} from '@testing-library/react'

import {WithAppContext, mockSession} from '~/utils/jest/WithAppContext'
import {WithProjectContext} from '~/utils/jest/WithProjectContext'
import {initialState as projectState} from '~/components/projects/edit/context/editProjectContext'

import SoftwareTestimonials from './index'
import config from './config'

// MOCKS
import mockTestimonials from './__mocks__/project_testimonials.json'

// Mock editTestimonial api calls
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockGetTestimonialsForProject = jest.fn(props => Promise.resolve(mockTestimonials))
const mockPostTestimonial = jest.fn(({testimonial}) => {
  return Promise.resolve({
    status: 201,
    message: testimonial
  })
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDeleteProjectTestimonial = jest.fn(props => Promise.resolve([] as any))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockPatchTestimonialPositions = jest.fn(props => Promise.resolve([] as any))
jest.mock('./apiProjectTestimonial', () => ({
  getTestimonialsForProject: jest.fn(props => mockGetTestimonialsForProject(props)),
  addProjectTestimonial: jest.fn(props => mockPostTestimonial(props)),
  deleteProjectTestimonial: jest.fn(props => mockDeleteProjectTestimonial(props)),
  patchTestimonialPositions: jest.fn(props => mockPatchTestimonialPositions(props)),
}))

describe('frontend/components/projects/edit/testimonials/index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders no testimonials message', async() => {
    // required prop
    projectState.id = 'test-project-id'
    // return no items
    mockGetTestimonialsForProject.mockResolvedValueOnce([])

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={projectState}>
          <SoftwareTestimonials />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))
    // validate no items message
    screen.getByText('No testimonials')
  })

  it('renders mocked testimonials', async() => {
    // required prop
    projectState.id = 'test-project-id'
    // return no items
    mockGetTestimonialsForProject.mockResolvedValueOnce(mockTestimonials)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={projectState}>
          <SoftwareTestimonials />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // validate number of items
    const testimonials = screen.getAllByTestId('testimonial-list-item')
    expect(testimonials.length).toEqual(mockTestimonials.length)
    // validate first item message
    expect(testimonials[0]).toHaveTextContent(mockTestimonials[0].message)
  })

  it('can add testimonial', async() => {
    // required prop
    projectState.id = 'test-project-id'
    // return no items
    mockGetTestimonialsForProject.mockResolvedValueOnce([])

    const newItem = {
      message: 'This is test message',
      source: 'This is test source'
    }

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={projectState}>
          <SoftwareTestimonials />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // click add button
    const addBtn = screen.getByRole('button', {
      name: 'Add'
    })
    fireEvent.click(addBtn)

    // get modal
    screen.getByRole('dialog')

    // write message
    const message = screen.getByRole('textbox', {
      name: config.message.label,
    })
    fireEvent.change(message, {target: {value: newItem.message}})

    // write source
    const source = screen.getByRole('textbox', {
      name: config.source.label,
    })
    fireEvent.change(source, {target: {value: newItem.source}})

    // click on save
    const saveBtn = screen.getByRole('button', {
      name: 'Save'
    })
    await waitFor(() => {
      expect(saveBtn).toBeEnabled()
      fireEvent.click(saveBtn)
    })

    // validate api call
    await waitFor(() => {
      expect(mockPostTestimonial).toHaveBeenCalledTimes(1)
      expect(mockPostTestimonial).toHaveBeenCalledWith({
        'testimonial': {
          'id': null,
          'message': newItem.message,
          'position': 1,
          'project': projectState.id,
          'source': newItem.source,
        },
        'token': 'TEST_TOKEN'
      })
    })
  })

  it('can edit testimonial', async() => {
    // required prop
    projectState.id = 'test-project-id'
    // return no items
    mockGetTestimonialsForProject.mockResolvedValueOnce(mockTestimonials)

    render(
      <WithAppContext options={{session:mockSession}}>
        <WithProjectContext state={projectState}>
          <SoftwareTestimonials />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get items
    const testimonials = screen.getAllByTestId('testimonial-list-item')
    // edit btn
    const editBtn = within(testimonials[0]).getByRole('button', {
      name: 'edit'
    })
    fireEvent.click(editBtn)

    // confirm modal has values
    const modal = screen.getByRole('dialog')

    // validate message value
    const message = screen.getByRole('textbox', {
      name: config.message.label,
    })
    expect(message).toHaveValue(mockTestimonials[0].message)

    // validate source value
    const source = screen.getByRole('textbox', {
      name: config.source.label,
    })
    expect(source).toHaveValue(mockTestimonials[0].source)

    // Cancel update action
    const cancelBtn = screen.getByRole('button', {
      name: 'Cancel'
    })
    fireEvent.click(cancelBtn)
    // validate modal is closed
    expect(modal).not.toBeVisible()
  })

  it('can delete testimonial', async () => {
    // required prop
    projectState.id = 'test-project-id'
    // return no items
    mockGetTestimonialsForProject.mockResolvedValueOnce(mockTestimonials)
    // mock delete response
    mockDeleteProjectTestimonial.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })
    // mock patch response
    mockPatchTestimonialPositions.mockResolvedValueOnce({
      status: 200,
      message: 'OK'
    })

    render(
      <WithAppContext options={{session: mockSession}}>
        <WithProjectContext state={projectState}>
          <SoftwareTestimonials />
        </WithProjectContext>
      </WithAppContext>
    )

    // wait for loader to
    await waitForElementToBeRemoved(screen.getByRole('progressbar'))

    // get items
    const testimonials = screen.getAllByTestId('testimonial-list-item')
    // edit btn
    const deleteBtn = within(testimonials[0]).getByRole('button', {
      name: 'delete'
    })
    fireEvent.click(deleteBtn)

    // confirm modal
    const confirmModal = screen.getByRole('dialog', {
      name: 'Remove testimonial'
    })
    // click on Remove button
    const removeBtn = within(confirmModal).getByRole('button', {
      name: 'Remove'
    })
    fireEvent.click(removeBtn)

    // validate api calls
    await waitFor(() => {
      // validate delete testimonial api
      expect(mockDeleteProjectTestimonial).toHaveBeenCalledTimes(1)
      expect(mockDeleteProjectTestimonial).toHaveBeenCalledWith({
        'id': mockTestimonials[0].id,
        'token': mockSession.token,
      })
      // validate patch testimonial positions called
      expect(mockPatchTestimonialPositions).toHaveBeenCalledTimes(1)
    })

    await waitFor(async() => {
      // validate item removed from list
      const remained = await screen.findAllByTestId('testimonial-list-item')
      expect(remained.length).toEqual(testimonials.length - 1)
    })
  })
})

