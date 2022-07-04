// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import AOS from 'aos'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/layout/AppFooter'
import Link from 'next/link'
import Image from 'next/image'

import styles from '~/components/home/home.module.css'

import LogoHelmholtz from '~/assets/logos/LogoHelmholtz.svg'
import PageContainer from '~/components/layout/PageContainer'

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

  const handleClickOpen = () => {
    const loginButton = document.querySelector('.rsd-login-button')
    if (loginButton) {
      const evt = new MouseEvent('click', {
        bubbles: true
      })
      loginButton.dispatchEvent(evt)
    }
  }

  const handleClickOpen = () => {
    const loginButton = document.querySelector('.rsd-login-button')
    if (loginButton) {
      const evt = new MouseEvent('click', {
        bubbles: true
      })
      loginButton.dispatchEvent(evt)
    }
  }

  return (
     <div className="bg-white text-white bg-secondary">

        <AppHeader/>

        {/* Head and claim */}
        <div className="bg-secondary bg-landing-page">
          <PageContainer className="flex flex-row flex-wrap text-white px-4 pt-16 pb-12">
            <div className="w-1/3 min-w-min flex flex-col pr-10">
              <LogoHelmholtz width="220" />
              <div className="pt-2 pb-12">Spitzenforschung für<br />große Herausforderungen.</div>
              <a onClick={handleClickOpen}>
                <div className="w-[250px] bg-[#05e5ba] hover:bg-primary text-secondary hover:text-white text-center font-medium text-2xl py-4 px-6 rounded-sm">
                  Add your software
                </div>
              </a>
            </div>
            <div className="w-2/3 xs:pt-6 sm:pt-0 md:pt-0 lg:pt-0 xl:pt-0">
              <div className="text-3xl">Promote and discover Research Software</div>
              <div className="text-2xl">Because software matters</div>
            </div>
          </PageContainer>
        </div>

        {/* Software spotlights */}
        <div className="bg-white">
          <PageContainer className="text-secondary px-6 pt-6 pb-12 xl:shadow-xl">
            <h1>Software Spotlights</h1>
            <h2 className="pb-4">Browse the latest outstanding software products in Helmholtz</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Id volutpat lacus laoreet non curabitur gravida arcu. Amet mauris commodo quis imperdiet massa tincidunt nunc. Varius sit amet mattis vulputate. Suscipit adipiscing bibendum est ultricies integer. Hendrerit gravida rutrum quisque non tellus. Eget felis eget nunc lobortis mattis aliquam. Integer enim neque volutpat ac tincidunt vitae. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant.</p>
          </PageContainer>
        </div>

        {/* Software meta repository */}
        <div className="bg-secondary xl:bg-white">
          <PageContainer className="bg-secondary text-white px-6 pt-6 pb-12 xl:shadow-xl">
            <h1>Software Meta Repository</h1>
            <h2 className="pb-4">Browse Software by Research Topic</h2>
            <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Id volutpat lacus laoreet non curabitur gravida arcu. Amet mauris commodo quis imperdiet massa tincidunt nunc. Varius sit amet mattis vulputate. Suscipit adipiscing bibendum est ultricies integer. Hendrerit gravida rutrum quisque non tellus. Eget felis eget nunc lobortis mattis aliquam. Integer enim neque volutpat ac tincidunt vitae. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant.</p>
            <div className="flex justify-end mt-12">
              <Link
                href="/software"
                passHref
              >
                <a>
                  <div className="w-[250px] bg-[#05e5ba] hover:bg-primary text-secondary hover:text-white text-center font-medium text-2xl py-4 px-6 rounded-sm">
                    Discover software
                  </div>
                </a>
              </Link>
            </div>
          </PageContainer>
        </div>

        {/* Roadmap */}
        <div className="bg-white">
          <PageContainer className="text-secondary px-6 pt-6 pb-12 xl:shadow-xl">
            <h1 className="pb-4">Roadmap</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Id volutpat lacus laoreet non curabitur gravida arcu. Amet mauris commodo quis imperdiet massa tincidunt nunc. Varius sit amet mattis vulputate. Suscipit adipiscing bibendum est ultricies integer. Hendrerit gravida rutrum quisque non tellus. Eget felis eget nunc lobortis mattis aliquam. Integer enim neque volutpat ac tincidunt vitae. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant.</p>
          </PageContainer>
        </div>

        <AppFooter/>
      </div>
  )
}
