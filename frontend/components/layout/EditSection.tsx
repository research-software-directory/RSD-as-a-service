// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ComponentPropsWithoutRef, ReactNode} from 'react'

type EditSectionProps = ComponentPropsWithoutRef<'section'> & {
  children: ReactNode;
}

export default function EditSection({
  children,
  className='',
  ...props
}:EditSectionProps) {
  return (
    <section className={`flex-1 ${className}`} {...props}>
      {children}
    </section>
  )
}
