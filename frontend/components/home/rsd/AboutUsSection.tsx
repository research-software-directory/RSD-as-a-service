// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useRsdSettings from '~/config/useRsdSettings'
import GradientBorderButton from './GradientBorderButton'
import {home_config} from './home_config'

const {button} = home_config

export default function AboutUsSection() {
  const {host} = useRsdSettings()

  return (
    <section
      id="about-us"
      className="px-5 md:px-10 py-5 w-full max-w-(--breakpoint-lg) mx-auto mt-10">
      <h2 className="flex justify-center text-3xl lg:text-4xl font-rsd-titles font-bold "
        data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
        About us
      </h2>
      <p className="text-center text-lg mt-5" data-aos="fade"
        data-aos-delay="100" data-aos-duration="400" data-aos-easing="ease-in-out">
        The Research Software Directory is an open source project initiated by the Netherlands
        eScience Center and jointly developed with Helmholtz. Feel free to
        contact us or join our effort!
      </p>
      <div
        className="max-w-(--breakpoint-md) mt-6 mx-auto flex flex-wrap justify-center gap-4 p-2 scale-90">
        <div className="flex justify-center" data-aos="fade" data-aos-delay="100"
          data-aos-duration="500" data-aos-easing="ease-in-out">
          <GradientBorderButton
            text={button.team.label}
            url={button.team.url}
            target={button.team.target}
            minWidth='14rem' />
        </div>
        {host.email ?
          <div className="flex justify-center" data-aos="fade" data-aos-duration="500"
            data-aos-easing="ease-in-out">
            <GradientBorderButton
              text={button.contact.label}
              url={button.contact.url}
              target={button.contact.target}
              minWidth='14rem' />
          </div>
          : null
        }
        <div className="flex justify-center" data-aos="fade" data-aos-delay="200"
          data-aos-duration="500" data-aos-easing="ease-in-out">
          <GradientBorderButton
            text={button.github.label}
            url={button.github.url}
            target={button.github.target}
            minWidth='14rem' />
        </div>
      </div>
    </section>
  )
}
