// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2026 Diego Alonso Alvarez (Imperial College London) <d.alonso-alvarez@imperial.ac.uk>
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Imperial College London
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import ImageWithPlaceholder, {ImageWithPlaceholderProps} from './ImageWithPlaceholder'

const mockProps:ImageWithPlaceholderProps = {
  src: null,
  alt: 'Test alt text',
  className: undefined,
  bgSize: undefined,
  bgPosition: undefined,
  placeholder: 'Test placeholder'
}

it('renders image icon with placeholder', () => {

  render(<ImageWithPlaceholder {...mockProps} />)

  const icon = screen.getByTestId('PhotoSizeSelectActualOutlinedIcon')
  expect(icon).toBeInTheDocument()

  if (mockProps.placeholder) {
    const placeholder = screen.getByText(mockProps.placeholder)
    expect(placeholder).toBeInTheDocument()
  }
})

it('renders image with default positioning', async() => {
  mockProps.src='/image/test-image.jpg'
  render(<ImageWithPlaceholder {...mockProps} />)

  // no placeholder icon
  const icon = screen.queryByTestId('PhotoSizeSelectActualOutlinedIcon')
  expect(icon).not.toBeInTheDocument()

  const img = screen.getByTestId('image-with-placeholder')
  expect(img).toBeInTheDocument()

  //expect image src attribute
  expect(img).toHaveAttribute('src', mockProps.src)
  // expect aria-label attribute
  // expect(img).toHaveAttribute('aria-label', mockProps.alt)
  // but not alt attribute
  expect(img).toHaveAttribute('alt', '')
  // expect title attribute
  expect(img).toHaveAttribute('title', mockProps.placeholder)
  // expect default positioning
  expect(img).toHaveAttribute('style','object-fit: contain; object-position: center;')
})
