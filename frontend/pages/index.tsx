// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: EUPL-1.2

/* eslint-disable @next/next/no-img-element */
import {useEffect, useState} from 'react'
import AOS from 'aos'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/layout/AppFooter'
import Link from 'next/link'
import Image from 'next/image'

import styles from '~/components/home/home.module.css'

import LogoHelmholtz from '~/assets/logos/LogoHelmholtz.svg'
import LogoHifis from '~/assets/logos/LogoHIFISBlue.svg'

/*! purgecss start ignore */
import 'aos/dist/aos.css'
import LogoEscience from '~/components/svg/LogoEscience'
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

type SpotlightDescription = {
  name: string,
  description: string,
  image: string,
  link: string
}

const SPOTLIGHTS= [
  {
    name: 'FishInspector',
    description: 'The software FishInspector provides automatic feature detections in images of zebrafish embryos (body size, eye size, pigmentation). It is Matlab-based and provided as a Windows executable (no matlab installation needed).',
    image: 'https://hifis.net/assets/img/spotlights/fishinspector/FishInspector.jpg',
    link: '/software'
  },
  {
    name: 'Golem',
    description: 'Golem is a modelling platform for thermal-hydraulic-mechanical and non-reactive chemical processes in fractured and faulted porous media.',
    image: 'https://hifis.net/assets/img/spotlights/golem/golem_preview.png',
    link: '/software/golem-a-moose-based-application'
  },
  {
    name: 'Lynx',
    description: 'LYNX (Lithosphere dYnamics Numerical toolboX) is a novel numerical simulator for modelling thermo-poromechanical coupled processes driving the deformation dynamics of the lithosphere.',
    image: 'https://hifis.net/assets/img/spotlights/lynx/lynx_logo.png',
    link: '/software/lynx-modelling-lithosperic-dynamics'
  },
  {
    name: 'MeshIt',
    description: 'The tool MeshIT generates quality tetrahedral meshes based on structural geological information. It has been developed at the GFZ Potsdam and some extensions were later added by PERFACCT. All procedures are fully automatized and require at least scattered data points as input.',
    image: 'https://hifis.net/assets/img/spotlights/meshit/meshit_logo.png',
    link: '/software/meshit'
  },
  {
    name: 'Palladio',
    description: 'Palladio is a software architecture simulation approach which analyses software at the model level for performance bottlenecks, scalability issues, reliability threats, and allows for subsequent optimisation.',
    image: 'https://hifis.net/assets/img/spotlights/palladio/palladio_preview.png',
    link: '/software/palladio'
  }
]

function LatestSpotlight({name, description, image, link}:
  {name:string, description:string, image:string, link: string}) {
  return(
    <Link
    href={link}
    passHref
    >
    <div className="w-full flex flex-row flex-wrap my-5 hover:bg-[#ecfbfd] hover:cursor-pointer relative group">
      <div className="md:w-2/3 overflow-hidden md:my-auto">
        <img alt={name} className="group-hover:scale-105 transition duration-100" src={image} />
      </div>
      <div className="md:w-1/3 md:pl-8 mt-auto text-xl">
        <div className="text-4xl py-2">{name}</div>
        <p>{description}</p>
      </div>
    </div>
  </Link>
  )
}

function PreviousSpotlight({name, image, link, description, i}:
  {name: string, image: string, link: string, description: string | '', i: number}) {

  const MAX_CHARS = 150
  function descriptionParagraph (description: string) {
    if (description != '') {
      if (description.length > MAX_CHARS) {
        let description_trunc = description.substring(0, MAX_CHARS)
        description = description_trunc.substring(0, description_trunc.lastIndexOf(' ')) + ' …'
      }
      return (
        <p>{description}</p>
      )
    }
  }

  return (
    <Link
      href={link}
      passHref
    >
      <div className="w-full sm:w-1/2 md:w-1/4 max-h-[15rem] py-[1rem] flex items-center relative group hover:bg-[#ecfbfd] hover:cursor-pointer">
        <img
          alt={name}
          className="max-h-[10rem] max-w-[100%] mx-auto p-[1rem] group-hover:blur-sm group-hover:opacity-50 group-hover:grayscale"
          src={image}
        />
        <div className="hidden group-hover:block group-hover:cursor-pointer absolute bottom-[1rem] left-[1rem]">
          <h2>{name}</h2>
          {descriptionParagraph(description)}
        </div>
      </div>
    </Link>
  )
}

function Spotlights({spotlights}:{spotlights: Array<SpotlightDescription>}) {
  let i = 0
  return (
    <div className="w-full">
      <LatestSpotlight
        name={spotlights[0].name}
        description={spotlights[0].description}
        image={spotlights[0].image}
        link={spotlights[0].link}
      />
      <div className="w-full flex flex-row flex-wrap py-5">
        {spotlights.slice(1, 5).map(spotlight => {
          i++
          let key = 'spotlight_' + i
          return(
            <PreviousSpotlight
              key={key}
              name={spotlight.name}
              image={spotlight.image}
              link={spotlight.link}
              description={spotlight.description}
              i={i}
            />
          )
        })}
      </div>
    </div>
  )
}


export default function Home({software,projects,organisations}:HomeProps) {
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

  return (
     <div className="bg-white">

        <AppHeader/>

        {/* Head and claim */}
        <div className="bg-secondary bg-landing-page">
          <div className="flex flex-row flex-wrap container mx-auto px-6 md:px-10 pt-16 pb-12 max-w-screen-xl text-white">
            <div className="min-w-min flex flex-col">
              <LogoHelmholtz width="220" />
              <div className="pt-1 pb-12">Research for grand challenges.</div>
              {/* <a onClick={handleClickOpen}>
                <div className="w-[250px] bg-[#05e5ba] hover:bg-primary text-secondary hover:text-white text-center font-medium text-2xl py-4 px-6 rounded-sm">
                  Add your software
                </div>
              </a> */}
            </div>
            <div className="xs:pt-6 sm:pt-0 md:pt-0 lg:pt-0 xl:pt-0 ml-auto">
              <h1 className="text-6xl">Promote and Discover <br/>Research Software</h1>
              <div className="text-2xl">Because software matters</div>
            </div>
          </div>
        </div>

        {/* Software spotlights */}
        <div className="conainer mx-auto p-6 md:p-10 max-w-screen-xl text-secondary">
          <h2 className='text-5xl'>Software Spotlights</h2>
          <div className='text-2xl mt-2'>Browse the latest outstanding software products in Helmholtz</div>
          <div className="w-full">
            <Spotlights spotlights={SPOTLIGHTS} />
          </div>
        </div>

        {/* Software meta repository */}
        <div className="conainer mx-auto p-12 max-w-screen-xl text-secondary bg-[#ecfbfd]">
          <h2 className='text-5xl'>Research Software Directory</h2>
          <div className="text-xl my-4">Browse Software by Research Topic</div>
          <p className="text-secondary text-xl my-6">
            The Research Software Directory is originally developed at the netherlands eScience center. < br/>
            In a joint collaboration, Helmholtz offers this portal that allows Research Software Engineers to promote their software.
          </p>
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
        </div>

        {/* Software spotlights */}
        <div className="conainer mx-auto p-6 md:p-10 max-w-screen-xl text-secondary">
          <div className='py-6'>
            <h2 className='text-5xl'>For RSEs and Researchers</h2>
            <div className="text-2xl my-4">A place for Research Software that is being developed in the Helmholtz Association.</div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">

              <div className='text-center text-2xl py-4'>
                {/* <div className="pb-4">For Research Software Engineers</div> */}
                <div className="grid gridl-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <div className="aspect-video grid place-items-center bg-center bg-cover group text-white bg-promote">
                    <div className="group-hover:hidden text-4xl">Promote</div>
                    <div className="hidden group-hover:block justify-center m-2">Increase the impact of your software by reaching a broader audience</div>
                  </div>
                  <div className="aspect-video grid place-items-center bg-center bg-cover group text-white bg-reference">
                    <div className="group-hover:hidden text-4xl">Impact</div>
                    <div className="hidden group-hover:block justify-center m-2">Gain acknowledgement by proper citation of your code</div>
                  </div>
                </div>
              </div>

              <div className='text-center text-2xl my-4'>
                {/* <div className="mb-4">For Researchers</div> */}
                <div className="grid gridl-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <div className="aspect-video grid place-items-center bg-center bg-cover group text-white bg-discover">
                    <div className="group-hover:hidden text-4xl">Discover</div>
                    <div className="hidden group-hover:block justify-center m-2">Discover software relevant to your research interest</div>
                  </div>
                  <div className="aspect-video grid place-items-center bg-center bg-cover group text-white bg-cite">
                    <div className="group-hover:hidden text-4xl">Cite</div>
                    <div className="hidden group-hover:block justify-center m-2">Version specific bibliography supports correct software citation</div>
                  </div>
                </div>
              </div>
              <div className="">
                <a onClick={handleClickOpen}>
                  <div className="w-[250px] bg-[#05e5ba] hover:bg-primary text-secondary hover:text-white text-center font-medium text-2xl py-4 px-6 rounded-sm">
                    Add your software
                  </div>
                </a>
              </div>
            </div>

            {/* <div className="text-2xl mt-8 mb-4">
              The Research Software Directory is open source and jointly developed by
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center pt-8 text-black">
                <a href="https://esciencecenter.nl" className="hover:cursor-pointer w-full grid place-items-center" target="_blank" rel="noreferrer">
                  <LogoEscience width="100%"/>
                </a>
                <a href="https://hifis.net" className="hover:cursor-pointer w-full grid place-items-center" target="_blank" rel="noreferrer">
                  <LogoHifis width="60%" />
                </a>
              </div>
            </div> */}
          </div>
        </div>

        {/* Roadmap */}
        {/* <div className="bg-white">
          <div className="conainer mx-auto py-6 px-4 max-w-screen-xl text-secondary">
            <h1 className="pb-4">Roadmap</h1>
            <p className="prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Id volutpat lacus laoreet non curabitur gravida arcu. Amet mauris commodo quis imperdiet massa tincidunt nunc. Varius sit amet mattis vulputate. Suscipit adipiscing bibendum est ultricies integer. Hendrerit gravida rutrum quisque non tellus. Eget felis eget nunc lobortis mattis aliquam. Integer enim neque volutpat ac tincidunt vitae. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant.</p>
          </div>
        </div> */}

        <AppFooter/>
      </div>
  )
}
