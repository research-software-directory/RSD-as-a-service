// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import AOS from 'aos'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/layout/AppFooter'
// import ThemeSwitcher from '~/components/layout/ThemeSwitcher'
// import SimpleCircle from '~/components/svg/SimpleCircle'
import Link from 'next/link'
import Image from 'next/image'

import styles from '~/components/home/home.module.css'
import LogoEscience from '~/assets/logos/LogoEscience.svg'
// import LogoSurf from '~/assets/logos/LogoSurf.svg'
import LogoHelmholtz from '~/assets/logos/LogoHelmholtz.svg'
import LogoUMC from '~/assets/logos/LogoUMC.svg'
import LogoUU from '~/assets/logos/LogoUU.svg'
import LogoLeiden from '~/assets/logos/LogoLeiden.svg'
import Arc from '~/components/home/arc.svg'
import {getHomepageCounts} from '~/components/home/getHomepageCounts'

/*! purgecss start ignore */
import 'aos/dist/aos.css'

/*! purgecss end ignore */

const whyrsd = [
  'Improves findability of software packages.',
  'Includes metadata to help search engines understand what a given software package is about.',
  'Harvests data from Zotero, Zenodo, GitHub, GitLab, and other sources.',
  'Presents software packages within their social and scientific context.',
  'Promotes dissemination of software.',
  // 'Modular system that is meant to be customizable, e.g. with respect to branding, database schemas, an so on..',
  'Makes scientific impact visible in a qualitative way.',
  'Helps decision-making based on metrics and graphs.',
  'Provides metadata via OAI-PMH, the standard protocol for metadata harvesting.',
  'The Research Software Directory is a content management system that is tailored to software.'
]

type HomeProps = {
  software: number,
  projects: number,
  organisations: number
}

export default function Home({software, projects, organisations}: HomeProps) {
  const [isDark, setDark] = useState(true)

  // Initialize AOS library
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <div className="bg-white dark:bg-black dark:text-white">
      {/* Header  */}
      <AppHeader/>

      {/* Jumbo Banner  */}
      <div className="mx-auto mt-20 relative overflow-x-clip">

        {/* Jumbo Image*/}
        <div className="max-w-[1200px] mx-auto ">
          <div
            className="pointer-events-none absolute w-full h-full -top-[170px] md:-top-48 -left-[60px] md:left-[50%] opacity-50 md:opacity-100">
            <Image src="/images/illustration.webp" width="847" height="760" alt="rsd-illustration"/>
          </div>
        </div>

        <div className="w-full max-w-screen-xl p-5 md:p-10 mx-auto">
          {/* Jumbo Text*/}
          <div className="w-full md:w-1/2 flex flex-col justify-center"
               data-aos="fade" data-aos-offset="200" data-aos-delay="50" data-aos-duration="1000"
          >
            <h1 className="text-5xl font-rsd-titles font-bold">
              Improving the <br/>impact of research software
            </h1>
            <div className="mt-8 text-lg">
              To promote the visibility, reuse and impact of research software,
              <span
                className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-green-400 px-1">
                  the Netherlands eScience Center
                </span>
              has developed the Research Software Directory, a content management system tailored to
              software.
            </div>

            {/* Email  */}
            {/* <div className="mt-10 flex gap-4">
              <input type="email"
                     className="border p-3 text-xl flex-1 text-white bg-transparent rounded-sm focus:outline-none"
                     placeholder="Email address"/>


              <button type="submit" className="relative group">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"></div>
                <div
                  className="relative px-3 py-3 bg-white ring-1 ring-gray-900/5 rounded leading-none flex items-center space-x-2">
                    <span className="space-y-2 text-black text-xl whitespace-nowrap">
                    Sign up for the RSD
                    </span>
                </div>

              </button>

            </div>*/}
            <div className="flex gap-4 md:gap-10 mt-10 items-center">
              <Link href="/software" passHref>
                <a className="flex gap-4 cursor-pointer"
                   data-aos="fade" data-aos-offset="200" data-aos-delay="50"
                   data-aos-duration="1000"
                   tabIndex={0}>
                  <div className="relative group">
                    <div
                      className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"/>
                    <div
                      className="flex gap-3 text-black relative px-8 py-3 bg-white ring-1 ring-gray-900/5 rounded leading-none items-center space-x-2 ">
                    <span className="space-y-2 text-xl font-medium  whitespace-nowrap ">
                      Discover Software
                    </span>
                    </div>
                  </div>
                </a>
              </Link>

              <a data-aos="fade" data-aos-offset="200" data-aos-delay="150" data-aos-duration="1000"
                 className="text-xl leading-6 text-transparent bg-clip-text bg-gradient-to-br from-[#FD54BB] to-[#1BECCB] "
                 target="_blank"
                 rel="noreferrer"
                 href="mailto:rsd@esciencecenter.nl?subject=More information about the RSD&body=Hi,
                  I would like to get in contact to start my organization within the Research
                  Software Directory"
              >
                Register your <br/> Organisation
              </a>
            </div>
          </div>
        </div>
      </div>

      {/*  Divider  */}
      <div className="w-full max-w-screen-xl mx-auto border-t border-[#90909060] mt-[80px]"></div>

      {/* stats  */}
      <div className="w-full max-w-screen-xl mx-auto flex flex-wrap gap-10 md:gap-16 p-5 md:p-10 ">
        <div>
          <div className="text-lg">{software} Software</div>
          <div className="opacity-40">packages</div>
        </div>

        <div>
          <div className="text-lg">{projects} Projects</div>
          <div className="opacity-40">registered</div>
        </div>

        <div>
          <div className="text-lg">{organisations} Organisations</div>
          <div className="opacity-40">contributed</div>
        </div>
      </div>

      <div className="bg-[#eee] dark:bg-[#111]">
        {/* Arc separator  */}
        <Arc className="w-full text-white dark:text-black -translate-y-1"></Arc>


        {/* cards  */}
        <div
          className="w-full max-w-screen-xl mt-6 mx-auto flex-col grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3 p-2 ">
          <div className=""
               data-aos="fade-up" data-aos-offset="0" data-aos-delay="0" data-aos-duration="400"
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

          <div data-aos="fade-up" data-aos-offset="0" data-aos-delay="50" data-aos-duration="400"
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
               data-aos="fade-up" data-aos-offset="0" data-aos-delay="100" data-aos-duration="400"
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
        </div>


        {/* Logos  */}
        <div className="w-full max-w-screen-xl mx-auto mt-10 p-5 md:p-10">
          <div id="whyrsd" className="text-2xl font-medium opacity-50">Partner Organizations</div>
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
        <div className="mt-20">
          <AppFooter/>
        </div>
      </div>
    </div>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps() {
  // extract params from page-query
  const counts = await getHomepageCounts()
  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      software: counts.software_cnt ?? null,
      projects: counts.project_cnt ?? null,
      organisations: counts.organisation_cnt ?? null
    },
  }
}
