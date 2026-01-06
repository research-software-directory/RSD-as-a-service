// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image'
import GradientBorderButton from './GradientBorderButton'
import {home_config} from './home_config'

const {button} = home_config

export default function LearnMoreSection() {
  return (
    <section
      id="learn-more"
      className="p-5 md:p-10 grid gap-12 grid-cols-1 sm:grid-cols-2 max-w-(--breakpoint-xl) mt-20 mx-auto">
      <div className="relative">

        <div className='sm:absolute -top-0 lg:-top-10 xl:-top-32 left-0 z-0'>
          <Image
            src="/images/screenshots.webp"
            width="877"
            height="767"
            alt="rsd-illustration"
          />
        </div>
      </div>
      <div>
        <h2 className="flex justify-center text-3xl lg:text-4xl font-rsd-titles font-bold "
          data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
          Learn more
        </h2>
        <p className="text-center text-lg mt-5" data-aos="fade"
          data-aos-delay="100" data-aos-duration="400" data-aos-easing="ease-in-out">
          Try out our online demo, or get more detailed information in our documentation and
          FAQ.
        </p>

        <div
          className="flex flex-wrap justify-center gap-4 p-2 scale-90 mt-5">
          <div className="flex justify-center" data-aos="fade-up" data-aos-duration="600"
            data-aos-easing="ease-in-out">
            <GradientBorderButton
              text={button.demo.label}
              url={button.demo.url}
              target={button.demo.target}
            />
          </div>
          <div className="flex justify-center" data-aos="fade-up" data-aos-duration="600"
            data-aos-delay="100"
            data-aos-easing="ease-in-out">
            <GradientBorderButton
              text={button.docs.label}
              url={button.docs.url}
              target={button.docs.target}
            />
          </div>
          <div className="flex justify-center" data-aos="fade-up" data-aos-duration="600"
            data-aos-delay="200"
            data-aos-easing="ease-in-out">
            <GradientBorderButton
              text={button.faq.label}
              url={button.faq.url}
              target={button.faq.target}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
