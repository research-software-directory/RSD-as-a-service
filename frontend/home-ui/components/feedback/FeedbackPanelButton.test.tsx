
import {render, screen} from '@testing-library/react'
import FeedbackPanelButton from './FeedbackPanelButton'

// todo: add tests for FeedbackPanelButton
it('it has feedback button', () => {
  render(
    <FeedbackPanelButton
      feedback_email='test@email.com'
      issues_page_url="test-issue-url"
    />
  )
  const btn = screen.getByRole('button',{name:'Send feedback'})
  expect(btn).toBeInTheDocument()
})
