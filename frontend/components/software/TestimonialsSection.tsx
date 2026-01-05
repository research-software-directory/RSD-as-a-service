// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Testimonial} from '../../types/Testimonial'
import PageContainer from '../layout/PageContainer'
import TestimonialItem from './TestimonialItem'

export default function TestimonialSection({testimonials = []}: {testimonials: Testimonial[]}) {
  // do not render section if no data
  if (testimonials?.length === 0) return null

  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr_4fr]">
      <h2
        data-testid="software-contributors-section-title"
        className="pb-8 text-[2rem] text-primary">
        Testimonials
      </h2>
      <section>
        {testimonials.map((item, pos) => {
          return (<TestimonialItem key={pos} item={item} />)
        })}
      </section>
    </PageContainer>
  )
}
