// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'

import SanitizedHtmlBox from './SanitizedMathMLBox'

it('render mathML element passed as string',()=>{
  const raw = `
    <math data-testid="math-ml-element">
      <mrow>
        <msup>
          <mi>a</mi>
          <mn>2</mn>
        </msup>
        <mo>+</mo>
        <msup>
          <mi>b</mi>
          <mn>2</mn>
        </msup>
        <mo>=</mo>
        <msup>
          <mi>c</mi>
          <mn>2</mn>
        </msup>
      </mrow>
    </math>
  `

  render(
    <SanitizedHtmlBox rawHtml={raw} />
  )
  // this will error automatically if not found
  screen.getByTestId('math-ml-element')
})

it('renders text only when h1 element passed', async()=>{
  const text = 'Test title'
  const raw = `
    <h1 data-testid="test-header">${text}</h1>
  `

  render(
    <SanitizedHtmlBox rawHtml={raw} />
  )

  const header = await screen.queryByTestId('test-header')

  expect(header).not.toBeInTheDocument()

  screen.getByText(text)
  // screen.debug()
})

it('renders text only when script injected', async()=>{
  const text = 'Test title'
  const raw = `
    <h1 data-testid="test-header">${text}</h1>
    <script>
      alert("alert box!");
    </script>
  `

  render(
    <SanitizedHtmlBox rawHtml={raw} />
  )


  // find text
  screen.getByText(text)

  // alert is not present
  const alert = screen.queryByText('alert box!')
  expect(alert).not.toBeInTheDocument()
  // screen.debug()
})

it('renders text only when button injected', async()=>{
  const text = 'Test button'
  const raw = `
    <button onclick="alert('Hijacked!')">
      ${text}
    </button>
  `

  render(
    <SanitizedHtmlBox
      rawHtml={raw}
    />
  )

  // find text
  screen.getByText(text)

  // button is not present
  const btn = screen.queryByRole('button')
  expect(btn).not.toBeInTheDocument()
  // screen.debug()
})

it('renders text only when link element passed', async()=>{
  const text = 'Test link'
  const raw = `
    <a href="https://google.com" data-testid="test-link">${text}</a>
  `

  render(
    <SanitizedHtmlBox rawHtml={raw} />
  )

  const link = await screen.queryByTestId('test-link')
  expect(link).not.toBeInTheDocument()

  screen.getByText(text)
})


it('renders link element when param passed to component', async()=>{
  const text = 'Test link'
  const url = 'https://google.com/test'
  const raw = `
    <a href="https://google.com" data-testid="test-link">${text}</a>
  `

  render(
    <SanitizedHtmlBox
      component="a"
      target="_blank"
      rel="noreferrer"
      href={url}
      rawHtml={raw}
    />
  )

  // check if a element is removed
  const testLink = await screen.queryByTestId('test-link')
  expect(testLink).not.toBeInTheDocument()

  // confirm the link exists
  const link = screen.getByRole('link',{name:text})
  // confirm target="_blank" is present
  expect(link).toHaveAttribute('target','_blank')
  // screen.debug()
})
