// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import AOS from 'aos'
import Link from 'next/link'
import Image from 'next/legacy/image'

import useRsdSettings from '~/config/useRsdSettings'
import {config} from './config'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import LandingPageCiteIcon from '~/components/icons/LandingPageCiteIcon.svg'
import LandingPageShowIcon from '~/components/icons/LandingPageShowIcon.svg'
import LandingPageShareIcon from '~/components/icons/LandingPageShareIcon.svg'
import LandingPageImpactIcon from '~/components/icons/LandingPageImpactIcon.svg'

import LogoEscience from '~/assets/logos/LogoEscience.svg'
import LogoHelmholtz from '~/assets/logos/LogoHelmholtz.svg'
import LogoUMC from '~/assets/logos/LogoUMC.svg'
import LogoUU from '~/assets/logos/LogoUU.svg'
import LogoLeiden from '~/assets/logos/LogoLeiden.svg'
import Arc from './arc.svg'
import PersonalSignUp from './PersonalSignUp'
import OrganisationSignUp from './OrganisationSignUp'

/*! purgecss start ignore */
import 'aos/dist/aos.css'

export type RsdHomeProps = {
  software_cnt: number,
  project_cnt: number,
  organisation_cnt: number,
  contributor_cnt: number,
  software_mention_cnt: number,
}

function GlowingButton({text,url,target='_self',minWidth='9rem'}: {text: string, url: string, target?:string, minWidth?:string}) {
  return <Link
    href={url}
    className="flex gap-4 cursor-pointer"
    target={target}
    passHref
    >
    <div className="relative group">
      <div
        className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"/>
      <div
        className="flex gap-3 text-black relative px-8 py-3 bg-white ring-1 ring-gray-900/5 rounded leading-none items-center justify-center space-x-2"
        style={{
          minWidth
        }}
      >
        <span className="space-y-2 text-xl font-medium whitespace-nowrap">
          {text}
        </span>
      </div>
    </div>
  </Link>
}

function LandingPageDivider() {
  return <div
    className="w-full max-w-screen-xl mx-auto border-t border-[#90909060] mt-[80px]"></div>
}

export default function RsdHome({software_cnt, project_cnt, organisation_cnt, contributor_cnt, software_mention_cnt}: RsdHomeProps) {
  const {host} = useRsdSettings()
  const {button} = config
  // Initialize AOS library
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <div className="bg-white dark:bg-black dark:text-white" data-testid="rsd-home-page">
      {/* Header  */}
      <AppHeader/>

      {/* Jumbo Banner  */}
      <div className="max-w-screen-xl mx-auto p-5 md:p-10 grid lg:grid-cols-[1fr,1fr] gap-[2rem]">
        {/* Jumbo Text*/}
        <div className="flex flex-col justify-center"
              data-aos="fade" data-aos-offset="200" data-aos-delay="50" data-aos-duration="1000"
        >
          <h1 className="text-5xl font-rsd-titles font-bold">
            Show your research software to the world
          </h1>
          <div className="mt-8 text-lg">
            The<span
            className="text-transparent font-medium bg-clip-text bg-gradient-to-tr from-[#03A9F1] to-[#09FBD3] px-1">
                Research Software Directory
              </span>
            is designed to show the impact research software has on research and society. We
            stimulate the reuse of research software and encourage proper citation of research
            software to ensure researchers and RSEs get credit for their work. {/*Learn more.*/}
          </div>
        </div>
        {/* Jumbo image */}
        <div className="relative">
          <Image
            src="/images/screenshots.webp"
            width="877"
            height="767"
            layout="intrinsic"
            alt="rsd-illustration"
          />
        </div>
      </div>

      {/* stats  */}
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-between gap-10 md:gap-16 p-5 md:p-10 ">
        <div>
          <div className="text-lg">{software_cnt} Software</div>
          <div className="opacity-50">packages registered</div>
        </div>

        <div>
          <div className="text-lg">{project_cnt} Projects</div>
          <div className="opacity-50">registered</div>
        </div>

        <div>
          <div className="text-lg">{organisation_cnt} Organisations</div>
          <div className="opacity-50">contributed</div>
        </div>

        <div>
          <div className="text-lg">{contributor_cnt} Contributors</div>
          <div className="opacity-50">to research software</div>
        </div>

        <div>
          <div className="text-lg">{software_mention_cnt} Mentions</div>
          <div className="opacity-50">of research software</div>
        </div>
      </div>

      <div className="bg-[#111]">
        {/* Arc separator  */}
        <Arc className="w-full text-white dark:text-black -translate-y-1"></Arc>

        {/* Get started section  */}
        <section
          id="get-started"
          className="px-5 md:px-10 py-5 ">
          <h2 className="flex justify-center text-4xl font-rsd-titles font-bold"
              data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Let's get started!
          </h2>
          <p className="text-center text-lg mt-5" data-aos="fade"
             data-aos-delay="100" data-aos-duration="400" data-aos-easing="ease-in-out">
            Discover research software relevant to your research! <br/>
            Get more information on how to add your own software or organization.
          </p>

          <div
            className="max-w-screen-lg mt-6 mx-auto flex flex-wrap justify-center gap-4 p-2 scale-90">
            <div className="flex justify-center"
              data-aos="fade-up" data-aos-duration="300" data-aos-easing="ease-in-out"
            >
              <GlowingButton
                text={button.discover.label}
                url={button.discover.url}
                target={button.discover.target}
                minWidth='19rem' />
            </div>
            <div className="flex justify-center" data-aos="fade-up" data-aos-delay="100"
              data-aos-duration="300"
              data-aos-easing="ease-in-out"
            >
              <PersonalSignUp
                minWidth='19rem'
              />
            </div>
            <div className="flex justify-center" data-aos="fade-up" data-aos-delay="200"
              data-aos-duration="300"
              data-aos-easing="ease-in-out"
            >
              <OrganisationSignUp
                minWidth='19rem'
              />
            </div>
          </div>
        </section>

        {/*  Divider  */}
        <LandingPageDivider/>

        {/* Our Goals Section */}
        <section
          id="our-goals"
          className="p-5 md:p-10 w-full max-w-screen-xl mx-auto">
          <h2
            className="flex justify-start text-4xl font-rsd-titles font-bold mt-6"
            data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
            Our goals
          </h2>

          <div className="grid gap-20 grid-cols-1 md:grid-cols-2 pt-14">
            <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="0">
              <LandingPageImpactIcon className="w-10 mr-5 pt-1 scale-125 flex-shrink-0"/>
              <div>
                <h3 className="mb-4 text-2xl font-medium">Show the impact of research software</h3>
                <p className="text-lg">
                  By showing how research software relates to other research
                  outputs, events, news items, etc.
                </p>
              </div>
            </article>
            <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="100">
              <LandingPageCiteIcon className="w-10 mr-5 pt-1 flex-shrink-0"/>
              <div>
                <h3 className="mb-4 text-2xl font-medium">
                  Encourage proper citation of research software</h3>
                <p className="text-lg">
                  We provide citation information that you can download and use in your
                  publications.
                </p>
              </div>
            </article>
            <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="0">
              <LandingPageShowIcon className="w-10 mr-5 pt-1 flex-shrink-0"/>
              <div>
                <h3 className="mb-4 text-2xl font-medium">Make it easy to find and reuse research
                  software</h3>
                <p className="text-lg">All information is collected on a single page, making it
                  easier to find software relevant to your research.</p>
              </div>
            </article>
            <article className="flex gap-4 items-start" data-aos="fade" data-aos-delay="100">
              <LandingPageShareIcon className="w-10 mr-5 pt-1 flex-shrink-0 scale-105"/>
              <div>
                <h3 className="mb-4 text-2xl font-medium">Share metadata about research
                  software</h3>
                <p className="text-lg">
                  The data we collect is openly accessible and shared with
                  other open science platforms.</p>
              </div>
            </article>
          </div>
        </section>


        {/*  Divider  */}
        <LandingPageDivider/>

        {/* Learn more section  */}
        <section
          id="learn-more"
          className="p-5 md:p-10 grid gap-12 grid-cols-1 sm:grid-cols-2 max-w-screen-xl mt-20 mx-auto">
          <div className="relative">
            <Image
              src="/images/learnMore.webp"
              width="1920"
              height="830"
              layout="responsive"
              alt="rsd learn more illustration"
            />
          </div>
          <div>
            <h2 className="flex justify-center text-4xl font-rsd-titles font-bold "
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
                <GlowingButton
                  text={button.demo.label}
                  url={button.demo.url}
                  target={button.demo.target}
                />
              </div>
              <div className="flex justify-center" data-aos="fade-up" data-aos-duration="600"
                   data-aos-delay="100"
                   data-aos-easing="ease-in-out">
                <GlowingButton
                  text={button.docs.label}
                  url={button.docs.url}
                  target={button.docs.target}
                />
              </div>
              <div className="flex justify-center" data-aos="fade-up" data-aos-duration="600"
                   data-aos-delay="200"
                   data-aos-easing="ease-in-out">
                <GlowingButton
                  text={button.faq.label}
                  url={button.faq.url}
                  target={button.faq.target}
                />
              </div>
            </div>
          </div>
        </section>

        {/*  Divider  */}
        <LandingPageDivider/>


        {/* About us section  */}
        <section
          id="about-us"
          className="px-5 md:px-10 py-5 w-full max-w-screen-lg mx-auto mt-10">
          <h2 className="flex justify-center text-4xl font-rsd-titles font-bold "
              data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            About us
          </h2>
          <p className="text-center text-lg mt-5" data-aos="fade"
             data-aos-delay="100" data-aos-duration="400" data-aos-easing="ease-in-out">
            The Research Software Directory is an open source project initiated by the Netherlands
            eScience Center and jointly developed with Helmholtz. Feel free to
            contact us or join our effort!
          </p>

          <div
            className="max-w-screen-md mt-6 mx-auto flex flex-wrap justify-center gap-4 p-2 scale-90">
            <div className="flex justify-center" data-aos="fade" data-aos-delay="100"
                 data-aos-duration="500" data-aos-easing="ease-in-out">
              <GlowingButton
                text={button.team.label}
                url={button.team.url}
                target={button.team.target}
                minWidth='14rem' />
            </div>
            {host.email &&
              <div className="flex justify-center" data-aos="fade" data-aos-duration="500"
                  data-aos-easing="ease-in-out">
                <GlowingButton
                  text={button.contact.label}
                  url={button.contact.url}
                  target={button.contact.target}
                  minWidth='14rem' />
              </div>
            }
            <div className="flex justify-center" data-aos="fade" data-aos-delay="200"
                 data-aos-duration="500" data-aos-easing="ease-in-out">
              <GlowingButton
                text={button.github.label}
                url={button.github.url}
                target={button.github.target}
                minWidth='14rem' />
            </div>
          </div>
        </section>


        {/*  Divider  */}
        <LandingPageDivider/>

        {/* Logos  */}
        <div
          id="partners"
          className="w-full max-w-screen-xl mx-auto mt-10 p-5 md:p-10">
          <div id="whyrsd" className="text-xl opacity-50">
            Partners using the Research Software Directory
          </div>
          <div
            className="flex gap-10 w-full max-w-screen-xl flex-wrap mt-6 p-3 md:p-10 items-center opacity-30">
            <LogoEscience className="max-w-[160px]"/>
            <LogoHelmholtz className="max-w-[130px]"/>
            <LogoUMC className="max-w-[200px]"/>
            <LogoUU className="max-w-[220px]"/>
            <LogoLeiden className="max-w-[220px]"/>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20"></div>
        <AppFooter/>
      </div>
    </div>
  )
}
