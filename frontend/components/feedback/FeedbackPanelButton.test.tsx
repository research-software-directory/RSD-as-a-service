// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, within} from '@testing-library/react'
import FeedbackPanelButton from './FeedbackPanelButton'

// todo: add tests for FeedbackPanelButton
it('it has feedback button', () => {
  render(
    <FeedbackPanelButton
      feedback_email='test@email.com'
      issues_page_url="test-issue-url"
    />
  )
  const btn = screen.getByTestId('feedback-button')
  expect(btn).toBeInTheDocument()
  expect(btn).toBeEnabled()
})

it('shows feedback dialog with cancel and send feedback', () => {
  render(
    <FeedbackPanelButton
      feedback_email='test@email.com'
      issues_page_url="test-issue-url"
    />
  )
  // click feedback button
  const btn = screen.getByTestId('feedback-button')
  fireEvent.click(btn)


  const dialog = screen.getByRole('dialog')
  // has cancel button
  within(dialog).getByRole('button',{name:'Cancel'})
  // has save link
  within(dialog).getByRole('link',{name:'Send feedback'})
  // screen.debug()
})
