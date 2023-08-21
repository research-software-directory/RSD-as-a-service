// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'

type ContentContainerProps = {
  element?: 'section' | 'article' | 'main' | 'div'
  className?: string
  children: React.JSX.Element | React.JSX.Element[]
}

export default function ContentContainer(props: ContentContainerProps) {
  // basic container alignment - for lg + breakpoints
  const classes = `px-4 lg:container lg:mx-auto ${props.className ?? ''}`

  switch (props?.element) {
    case 'section':
      return (
        <section className={classes}>
          {props.children}
        </section>
      )
    case 'article':
      return (
        <article className={classes}>
          {props.children}
        </article>
      )
    case 'main':
      return (
        <main className={classes}>
          {props.children}
        </main>
      )
    default:
      return (
        <div className={classes}>
          {props.children}
        </div>
      )
  }
}
