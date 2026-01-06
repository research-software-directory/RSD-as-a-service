// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import LandingPageCiteIcon from '~/components/icons/LandingPageCiteIcon.svg'
import LandingPageShowIcon from '~/components/icons/LandingPageShowIcon.svg'
import LandingPageShareIcon from '~/components/icons/LandingPageShareIcon.svg'
import LandingPageImpactIcon from '~/components/icons/LandingPageImpactIcon.svg'

export default function OurGoalsSection() {
  return (
    <section
      id="our-goals"
      className="p-5 md:p-10 w-full max-w-(--breakpoint-xl) mx-auto">
      <h2
        className="flex justify-start text-3xl lg:text-4xl font-rsd-titles font-bold mt-6"
        data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
        Our goals
      </h2>

      <div className="grid gap-20 grid-cols-1 md:grid-cols-2 pt-14">
        <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="0">
          <LandingPageImpactIcon className="h-auto mr-5 pt-1 scale-125 shrink-0" />
          <div>
            <h3 className="mb-4 text-2xl font-medium">Show the impact of research software</h3>
            <p className="text-lg opacity-70">
              By showing how research software relates to other research
              outputs, events, news items, etc.
            </p>
          </div>
        </article>
        <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="100">
          <LandingPageCiteIcon className="h-auto mr-5 pt-1 shrink-0" />
          <div>
            <h3 className="mb-4 text-2xl font-medium">
              Encourage proper citation of research software</h3>
            <p className="text-lg opacity-70">
              We provide citation information that you can download and use in your
              publications.
            </p>
          </div>
        </article>
        <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="0">
          <LandingPageShowIcon className="h-auto mr-5 pt-1 shrink-0" />
          <div>
            <h3 className="mb-4 text-2xl font-medium">Make it easy to find and reuse research
              software</h3>
            <p className="text-lg opacity-70">All information is collected on a single page, making it
              easier to find software relevant to your research.</p>
          </div>
        </article>
        <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="100">
          <LandingPageShareIcon className="h-auto mr-5 pt-1 shrink-0 scale-105" />
          <div>
            <h3 className="mb-4 text-2xl font-medium">Share metadata about research
              software</h3>
            <p className="text-lg opacity-70">
              The data we collect is openly accessible and shared with
              other open science platforms.</p>
          </div>
        </article>
      </div>
    </section>
  )
}
