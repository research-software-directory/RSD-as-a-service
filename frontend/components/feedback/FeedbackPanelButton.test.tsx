import {render, screen} from '@testing-library/react'
import FeedbackPanelButton from './FeedbackPanelButton'

it('it has feedback button', () => {
  render(<FeedbackPanelButton />)
  const btn = screen.getByRole('button')
  expect(btn).toBeInTheDocument()
})
