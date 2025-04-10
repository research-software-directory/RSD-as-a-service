// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type BaseSurfaceRoundedProps = Readonly<{
  children: any
  className?: string
  type?: 'div' | 'section' | 'nav'
  props?: any
}>


export default function BaseSurfaceRounded({children, className = '', type = 'div', ...props}: BaseSurfaceRoundedProps) {
  const classes =`bg-base-100 rounded-sm ${className}`

  switch (type) {
    case 'section':
      return (
        <section className={classes} {...props}>
          {children}
        </section>
      )
    case 'nav':
      return (
        <nav className={classes} {...props}>
          {children}
        </nav>
      )
    default:
      return (
        <div className={classes} {...props}>
          {children}
        </div>
      )
  }

}
