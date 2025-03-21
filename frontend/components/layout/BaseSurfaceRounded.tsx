// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type BaseSurfaceRoundedProps = {
  children: any
  className?: string
  type?: 'div' | 'section' | 'nav'
}


export default function BaseSurfaceRounded({children, className = '', type = 'div'}: BaseSurfaceRoundedProps) {
  const classes =`bg-base-100 rounded-sm ${className}`

  switch (type) {
    case 'section':
      return (
        <section className={classes}>
          {children}
        </section>
      )
    case 'nav':
      return (
        <nav className={classes}>
          {children}
        </nav>
      )
    default:
      return (
        <div className={classes}>
          {children}
        </div>
      )
  }

}
