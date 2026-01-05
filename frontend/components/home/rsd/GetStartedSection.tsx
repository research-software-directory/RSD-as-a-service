// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import PersonalSignUp from './PersonalSignUp'
import OrganisationSignUp from './OrganisationSignUp'
import {home_config} from './home_config'

const {button} = home_config

function GlowingButton({text, url, target = '_self', minWidth = '9rem'}: {text: string, url: string, target?: string, minWidth?: string}) {
  return <a
    href={url}
    className="flex gap-4 cursor-pointer"
    target={target}
  >
    <div className="relative group">
      <div
        className="absolute -inset-1 bg-linear-to-r from-glow-start to-glow-end rounded-lg blur-sm opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300" />
      <div
        className="flex gap-3 text-base-900 relative px-8 py-3 bg-base-100 ring-1 rounded-sm leading-none items-center justify-center space-x-2"
        style={{minWidth}}
      >
        <span className="space-y-2 text-xl font-medium whitespace-nowrap">
          {text}
        </span>
      </div>
    </div>
  </a>
}

export default function GetStartedSection() {
  return (
    <section
      id="get-started"
      className="p-5 md:px-10">
      <h2 className="flex justify-center text-3xl lg:text-4xl font-rsd-titles font-bold"
        data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
        Let&apos;s get started!
      </h2>
      <p className="text-center text-lg mt-5" data-aos="fade"
        data-aos-delay="100" data-aos-duration="400" data-aos-easing="ease-in-out">
        Discover research software relevant to your research! <br />
        Get more information on how to add your own software or organization.
      </p>
      <div
        className="max-w-(--breakpoint-lg) mt-6 mx-auto flex flex-wrap justify-center gap-4 p-2 scale-90">
        <div className="flex justify-center"
          data-aos="fade" data-aos-duration="600" data-aos-easing="ease-in-out"
        >
          <GlowingButton
            text={button.discover.label}
            url={button.discover.url}
            target={button.discover.target}
            minWidth='19rem' />
        </div>
        <div className="flex justify-center" data-aos="fade" data-aos-delay="100"
          data-aos-duration="600"
          data-aos-easing="ease-in-out"
        >
          <PersonalSignUp minWidth='19rem' />
        </div>
        <div className="flex justify-center" data-aos="fade" data-aos-delay="200"
          data-aos-duration="600"
          data-aos-easing="ease-in-out"
        >
          <OrganisationSignUp minWidth='19rem' />
        </div>
      </div>
    </section>
  )
}
