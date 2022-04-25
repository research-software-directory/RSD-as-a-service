import {useEffect, useState} from 'react'
import AOS from 'aos'
import AppFooter from '~/components/layout/AppFooter'
import ThemeSwitcher from '~/components/layout/ThemeSwitcher'
import SimpleCircle from '~/components/svg/SimpleCircle'
import Link from 'next/link'
import Image from 'next/image'

import LogoApp from '~/assets/LogoApp.svg'
import LogoAppSmall from '~/assets/LogoAppSmall.svg'

import LoginButton from '~/components/login/LoginButton'
import styles from '~/components/home/home.module.css'

import LogoEscience from '~/assets/logos/LogoEscience.svg'
import LogoSurf from '~/assets/logos/LogoSurf.svg'
import LogoHelmholtz from '~/assets/logos/LogoHelmholtz.svg'
import LogoUMC from '~/assets/logos/LogoUMC.svg'
import LogoUU from '~/assets/logos/LogoUU.svg'
import LogoLeiden from '~/assets/logos/LogoLeiden.svg'

import Arc from '~/components/home/arc.svg'
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


export default function Home() {
  const [isDark, setDark] = useState(true)

  // Initialize AOS library
  useEffect(() => { AOS.init() }, [])

  return (
      <div className="bg-white dark:bg-black dark:text-white">
        {/* Header  */}
        <header
          data-testid="Landing Page"
          className="sticky top-0 px-5 md:px-10 z-10 backdrop-filter backdrop-blur-xl bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-60">

          <div className="w-full max-w-screen-xl mx-auto flex py-6 items-center">
            <Link href="/" passHref>
              <a className="hover:shadow-2xl">
                <LogoApp className="hidden xl:block"/>
                <LogoAppSmall className="block xl:hidden"/>
              </a>
            </Link>
            <div className="flex flex-1">
              <div className="hidden sm:flex w-full text-lg ml-28 gap-5 text-center opacity-80 ">
                <a href="#whyrsd">Why RSD</a>
                <Link href="/software">Software</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/organisations">Organisations</Link>
                {/*<Link href="/about">About us</Link>*/}
              </div>
            </div>

            {/*Search*/}
            {/*<div className="border px-3 py-2 flex relative ml-auto rounded-sm">*/}
            {/*  <svg className="absolute right-[10px] top-[10px]" width="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*    <circle cx="8.98438" cy="9.10718" r="8.22705" stroke="currentColor"/>*/}
            {/*  </svg>*/}
            {/*  <input type="search" className="bg-transparent focus:outline-none"*/}
            {/*         placeholder="Search Software" autoComplete="off"/>*/}
            {/*</div>*/}

            <ThemeSwitcher className="mr-3"/>

            <LoginButton/>
          </div>

        </header>

        {/* Jumbo Banner  */}
        <div className="mx-auto mt-20 relative overflow-x-clip">

          {/* Jumbo Image*/}
          <div className="max-w-[1200px] mx-auto ">
            <div className="

              absolute
              w-full
              h-full
              -top-[170px] md:-top-48
              -left-[60px] md:left-[50%]
              opacity-50 md:opacity-100
                ">
            <Image src="/images/illustration.webp" width="847" height="760"
              alt="rsd-illustration"
            />
            </div>
          </div>

          <div className="w-full max-w-screen-xl p-5 md:p-10 mx-auto">
            {/* Jumbo Text*/}
            <div className="w-full md:w-1/2 flex flex-col justify-center"
                 data-aos="fade" data-aos-offset="200" data-aos-delay="50" data-aos-duration="1000"
            >
              <div className="text-5xl font-rsd-titles font-bold">
                Encouraging the <br/>re-use of research software
              </div>
              <div className="mt-8 text-lg">
                To promote the visibility, impact and reuse of research software,
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-green-400 px-1">
                  the Netherlands eScience Center
                </span>
                 has developed the Research Software Directory, a content management system tailored to software.
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

            <div className="mt-10 flex gap-4"
                 data-aos="fade" data-aos-offset="200" data-aos-delay="50" data-aos-duration="1000">
              <button type="submit" className="relative group">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"/>
                <a
                  href="mailto:rsd@esciencecenter.nl?subject=More information about the RSD&body=Hi, I would like to get in contact to start my organization within the Research Software Directory"
                  className="flex gap-3 text-black relative px-3 py-3 bg-white ring-1 ring-gray-900/5 rounded leading-none flex items-center space-x-2 ">
                    <span className="space-y-2 text-xl whitespace-nowrap ">
                      Sign up for the RSD
                    </span>
                </a>
              </button>
            </div>
            </div>
          </div>
        </div>

        {/*  Divider  */}
        <div className="w-full max-w-screen-xl mx-auto border-t border-[#90909060] mt-[80px]"></div>

        {/* stats  */}
        <div className="w-full max-w-screen-xl mx-auto flex flex-wrap gap-10 md:gap-16 p-5 md:p-10 ">
          <div>
            <div className="text-lg"> 30+ thousands</div>
            <div className="opacity-40">Researchers</div>
          </div>

          <div>
            <div className="text-lg">20 Research Centers</div>
            <div className="opacity-40">Organizations</div>
          </div>

          <div>
            <div className="text-lg"> 500+ Software</div>
            <div className="opacity-40">Packages</div>
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
                      Find and judge the relevance and quality of <span className="text-blue-400"> research software </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=""
                 data-aos="fade-up" data-aos-offset="0" data-aos-delay="50" data-aos-duration="400"
                 data-aos-easing="ease-in-out">
              <div className={`${styles.card} h-full`}>
                <div className={styles.cardInside}
                     style={{backgroundImage: 'url("/images/bg_card.svg")'}}>
                  <div className="flex flex-col justify-center" style={{}}
                  >
                    <div className="text-3xl font-medium">
                      Recognize
                    </div>
                    <div className="text-lg mt-5">Encourages research software engineers to make
                      their research software findable and accessible, ensuring
                      recognition of their work
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
                    <div className="text-lg mt-5">Facilitates research institutes to showcase the
                      software produced by their organization and
                      monitor its reuse and impact
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
              <LogoSurf className="max-w-[75px]"/>
              <LogoHelmholtz className="max-w-[130px]"/>
              <LogoUMC className="max-w-[200px]"/>
              <LogoUU className="max-w-[220px]"/>
              <LogoLeiden className="max-w-[220px]"/>
            </div>
          </div>


          {/* Why RSD */}
          <div className="w-full max-w-screen-xl mx-auto p-5 md:p-10"
               data-aos="fade" data-aos-offset="0" data-aos-duration="400"
               data-aos-easing="ease-in-out">
            <div id="whyrsd" className="text-3xl font-rsd-titles font-bold">Why the RSD?</div>

            {/* software into context  */}
            <div className={`${styles.card} w-full max-w-screen-xl mx-auto mt-5`}
                 data-aos="fade" data-aos-offset="0" data-aos-duration="400"
                 data-aos-easing="ease-in-out">
              <div className={styles.cardInside}
                   style={{backgroundImage: 'url("/images/context_bg.svg")'}}>
                <div className="flex flex-col justify-center dark:text-white text-black">
                  <div className="text-3xl  font-medium">
                    Software in context
                  </div>
                  <div className="text-lg mt-5">All software on the research Software Directory is
                    presented within its research context. Every page
                    contains links to research papers, projects, and presentations for example. The
                    pages also show a social context- who are the
                    developers, how active is the development, are there ay tutorials, blog posts,
                    or videos?
                  </div>
                </div>
              </div>
            </div>

            <ul className="mt-10 ">
              {whyrsd.map((text, i) =>
                <li className="flex gap-3 items-center mt-3 text-lg" key={i}>
                  <span className="w-auto"><SimpleCircle/> </span>{text}
                </li>
              )}
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-20">
            <AppFooter/>
          </div>
        </div>
      </div>
  )
}
