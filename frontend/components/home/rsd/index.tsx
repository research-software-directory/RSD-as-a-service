// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import AOS from 'aos'
import Link from 'next/link'
import Image from 'next/image'

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

/*! purgecss start ignore */
import 'aos/dist/aos.css'

export type RsdHomeProps = {
  software_cnt: number,
  project_cnt: number,
  organisation_cnt: number,
  developers_cnt: number, // todo: get this from the backend
  citations_cnt: number, // todo: get this from the backend
}

function GlowingButton({text, url}: { text: string, url: string }) {
  return <Link href={url} passHref>
    <a className="flex gap-4 cursor-pointer" tabIndex={0}>
      <div className="relative group">
        <div
          className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"/>
        <div
          className="flex gap-3 text-black relative px-8 py-3 bg-white ring-1 ring-gray-900/5 rounded leading-none items-center space-x-2 "
        >
          <span className="space-y-2 text-xl font-medium  whitespace-nowrap ">
            {text}
          </span>
        </div>
      </div>
    </a>
  </Link>
}

function LandingPageDivider() {
  return <div
    className="w-full max-w-screen-xl mx-auto border-t border-[#90909060] mt-[80px]"></div>
}

export default function RsdHome({software_cnt, project_cnt, organisation_cnt}: RsdHomeProps) {
  // Initialize AOS library
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <div className="bg-white dark:bg-black dark:text-white" data-testid="rsd-home-page">
      {/* Header  */}
      <AppHeader/>

      {/* Jumbo Banner  */}
      <div className="mx-auto mt-20 relative overflow-x-clip ">

        {/* Jumbo Image*/}
        <div
          className="pointer-events-none absolute w-full h-full -top-[170px] md:-top-48 -left-[60px] md:left-[50%] opacity-50 md:opacity-100">
          <Image src="/images/illustration.webp" width="847" height="760" alt="rsd-illustration"/>
        </div>

        <div className="w-full p-5 md:p-10 max-w-screen-xl mx-auto">
          {/* Jumbo Text*/}
          <div className="w-full md:w-1/2 flex flex-col justify-center"
               data-aos="fade" data-aos-offset="200" data-aos-delay="50" data-aos-duration="1000"
          >
            <h1 className="text-5xl font-rsd-titles font-bold">
              Showing the impact <br/>
              of research software
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

            <div className="flex gap-4 md:gap-10 mt-10 items-center">
              <GlowingButton text="Discover Software" url="/software"/>

              {/* Resgister with email button */}

              {/*<a data-aos="fade" data-aos-offset="200" data-aos-delay="150" data-aos-duration="1000"*/}
              {/*   className="text-xl leading-6 text-transparent bg-clip-text bg-gradient-to-br from-[#FD54BB] to-[#1BECCB] "*/}
              {/*   target="_blank"*/}
              {/*   rel="noreferrer"*/}
              {/*   href="mailto:rsd@esciencecenter.nl?subject=More information about the RSD&body=Hi,*/}
              {/*    I would like to get in contact to start my organization within the Research*/}
              {/*    Software Directory"*/}
              {/*>*/}
              {/*  Register your <br/> Organisation*/}
              {/*</a>*/}
            </div>
          </div>
        </div>
      </div>

      {/*  Divider  */}
      <LandingPageDivider/>

      {/* stats  */}
      <div className="w-full max-w-screen-xl mx-auto flex flex-wrap gap-10 md:gap-16 p-5 md:p-10 ">
        <div>
          <div className="text-lg">{software_cnt} Software</div>
          <div className="opacity-40">packages</div>
        </div>

        <div>
          <div className="text-lg">{project_cnt} Projects</div>
          <div className="opacity-40">registered</div>
        </div>

        <div>
          <div className="text-lg">{organisation_cnt} Organisations</div>
          <div className="opacity-40">contributed</div>
        </div>

        <div>
          <div className="text-lg">354 Software</div>
          <div className="opacity-40">developers</div>
        </div>

        <div>
          <div className="text-lg">708 Software</div>
          <div className="opacity-40">citations</div>
        </div>
      </div>

      <div className="bg-[#111]">
        {/* Arc separator  */}
        <Arc className="w-full text-white dark:text-black -translate-y-1"></Arc>


        {/* Feature Cards  - Saved for later */}
        {/*<div
          className="w-full max-w-screen-xl mt-6 mx-auto flex-col grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3 p-2 ">
          <div className=""
               data-aos="fade-up" data-aos-duration="400"
               data-aos-easing="ease-in-out"
          >
            <div className={`${styles.card} h-full`}>
              <div className={styles.cardInside}
                   style={{backgroundImage: 'url("/images/bg_card.svg")'}}>
                <div className="flex flex-col justify-center">
                  <div className="text-3xl font-medium">
                    Discover
                  </div>
                  <div className="text-lg mt-5">
                    Find

                    <span
                      className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-green-400 px-1">
                  research software
                </span>
                    that is relevant to your research
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="50" data-aos-duration="400"
               data-aos-easing="ease-in-out">
            <div className={`${styles.card} h-full`}>
              <div className={styles.cardInside}
                   style={{backgroundImage: 'url("/images/bg_card.svg")'}}>
                <div className="flex flex-col justify-center" style={{}}
                >
                  <div className="text-3xl font-medium">
                    Share
                  </div>
                  <div className="text-lg mt-5">
                    Showcase your research software and promote reuse by others.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=""
               data-aos="fade-up" data-aos-delay="100" data-aos-duration="400"
               data-aos-easing="ease-in-out">
            <div className={`${styles.card} h-full`}>
              <div className={styles.cardInside}
                   style={{backgroundImage: 'url("/images/bg_card.svg")'}}>
                <div className="flex flex-col justify-center">
                  <div className="text-3xl font-medium">
                    Impact
                  </div>
                  <div className="text-lg mt-5">
                    Enable developers and research organizations to monitor the impact of their
                    research software.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>*/}


        {/* Get started section  */}
        <section className="px-5 md:px-10 py-5 ">
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
            className="w-full max-w-screen-lg mt-6 mx-auto flex-col grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-2 scale-90">
            <div className="flex justify-center"
                 data-aos="fade-up" data-aos-duration="300" data-aos-easing="ease-in-out"
            >
              <GlowingButton text="Discover Software" url="/software"/>
            </div>
            <div className="flex justify-center" data-aos="fade-up" data-aos-delay="100"
                 data-aos-duration="300"
                 data-aos-easing="ease-in-out"
            >
              <GlowingButton text="Add your Software" url="/"/>
            </div>
            <div className="flex justify-center" data-aos="fade-up" data-aos-delay="200"
                 data-aos-duration="300"
                 data-aos-easing="ease-in-out"
            >
              <GlowingButton text="Register your organization" url="/"/>
            </div>
          </div>
        </section>

        {/*  Divider  */}
        <LandingPageDivider/>

        {/* Our Goals Section */}
        <section className="p-5 md:p-10 w-full max-w-screen-xl mx-auto">
          <h2
            className="flex justify-start text-3xl font-rsd-titles font-bold mt-6"
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
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 w-full max-w-screen-xl mt-20 mx-auto">
          <Image src="/images/learnMore.webp" width="1475" height="638"
                 alt="rsd learn more illustration"/>
          <div className="px-5 md:px-10 py-5 w-full max-w-screen-lg mx-auto">
            <h2 className="flex justify-center text-4xl font-rsd-titles font-bold "
                data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
              Learn more
            </h2>
            <p className="text-center text-lg mt-5" data-aos="fade"
               data-aos-delay="100" data-aos-duration="400" data-aos-easing="ease-in-out">
              Try out our online demo, or get more detailed information in our documentation and
              faq.
            </p>

            <div
              className="flex-col grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2 scale-90 mt-5">
              <div className="flex justify-center" data-aos="zoom-out" data-aos-duration="600"
                   data-aos-easing="ease-in-out">
                <GlowingButton text="About us" url="/"/>
              </div>
              <div className="flex justify-center" data-aos="zoom-out" data-aos-duration="600"
                   data-aos-delay="100"
                   data-aos-easing="ease-in-out">
                <GlowingButton text="Docs" url="/"/>
              </div>
              <div className="flex justify-center" data-aos="zoom-out" data-aos-duration="600"
                   data-aos-delay="200"
                   data-aos-easing="ease-in-out">
                <GlowingButton text="FAQs" url="/"/>
              </div>
            </div>
          </div>
        </section>

        {/*  Divider  */}
        <LandingPageDivider/>


        {/* About us section  */}
        <section className="px-5 md:px-10 py-5 w-full max-w-screen-lg mx-auto mt-10">
          <h2 className="flex justify-center text-4xl font-rsd-titles font-bold "
              data-aos="fade" data-aos-duration="400" data-aos-easing="ease-in-out">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            About us
          </h2>
          <p className="text-center text-lg mt-5" data-aos="fade"
             data-aos-delay="100" data-aos-duration="400" data-aos-easing="ease-in-out">
            The Research Software Directory is an open source project initiated by the Netherlands
            eScience Center. We are always open for improvements and discussions. Feel free to
            contact us or join our effort!
          </p>

          <div
            className="w-full max-w-screen-md mt-6 mx-auto flex-col grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2 scale-90">
            <div className="flex justify-center" data-aos="fade" data-aos-duration="500"
                 data-aos-easing="ease-in-out">
              <GlowingButton text="Contact us" url="/"/>
            </div>
            <div className="flex justify-center" data-aos="fade" data-aos-delay="100"
                 data-aos-duration="500" data-aos-easing="ease-in-out">
              <GlowingButton text="Meet our team" url="/"/>
            </div>
            <div className="flex justify-center" data-aos="fade" data-aos-delay="200"
                 data-aos-duration="500" data-aos-easing="ease-in-out">
              <GlowingButton text="Join us on GitHub" url="/"/>
            </div>
          </div>
        </section>


        {/*  Divider  */}
        <LandingPageDivider/>

        {/* Logos  */}
        <div className="w-full max-w-screen-xl mx-auto mt-10 p-5 md:p-10">
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
