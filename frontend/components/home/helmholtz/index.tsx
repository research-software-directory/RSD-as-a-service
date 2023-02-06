// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @next/next/no-img-element */

import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import Link from 'next/link'

import LogoHelmholtz from '~/assets/logos/LogoHelmholtz.svg'
import {OrganisationForOverview} from '~/types/Organisation'

/*! purgecss start ignore */
// import 'aos/dist/aos.css'

import IconButton from '@mui/material/IconButton'
import {ChevronLeft, ChevronRight} from '@mui/icons-material'
import {useAuth} from '~/auth'
import {getImageUrl} from '~/utils/editImage'
import useOrganisations from './useOrganisations'
/*! purgecss end ignore */

// type HomeProps = {
//   software: number,
//   projects: number,
//   organisations: number
// }

type SpotlightDescription = {
  name: string,
  description: string,
  image: string,
  link: string
}

const SPOTLIGHTS= [
  // {
  //   name: 'MassBank',
  //   description: 'MassBank is an open source mass spectral library for the identification of small chemical molecules of metabolomics, exposomics and environmental relevance.',
  //   image: 'https://hifis.net/assets/img/spotlights/massbank/Atrazine_Mass_Spectrum.png',
  //   link: '/software'
  // },
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

function ResearchField({background, name}:{background: string, name: string}) {
  function mouseEnter(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!(event.target instanceof HTMLAnchorElement)) return
    const background = '/images/' + event.target.dataset.background
    event.target.parentElement!.parentElement!.style.backgroundImage = 'url("' + background + '")'
  }

  return (
    <a onMouseEnter={mouseEnter} data-background={background}>{name}</a>
  )
}

function ResearchFields() {
  return (
    <div id="researchTopicBox" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 text-center text-3xl place-items-center py-16">
      <ResearchField background="pexels-pixabay-414837.jpg" name="Energy" />
      <ResearchField background="pexels-blue-ox-studio-695299.jpg" name="Earth & Environment" />
      <ResearchField background="pexels-rfstudio-3825529.jpg" name="Health" />
      <ResearchField background="jj-ying-8bghKxNU1j0-unsplash.jpg" name="Information" />
      <ResearchField background="pexels-aleksejs-bergmanis-681335.jpg" name="Aeronautics, Space and Transport" />
      <ResearchField background="desy_yulia-buchatskaya-hYvZHggmuc4-unsplash.jpg" name="Matter" />
    </div>
  )
}

function clearBackgroundImage(event: React.MouseEvent<HTMLDivElement>) {
  if (!(event.target instanceof HTMLDivElement)) return
  event.target.style.backgroundImage = ''
}

function ParticipatingOrganisations({organisations}:{organisations:OrganisationForOverview[]}) {
  return (
    <div className="w-full h-full relative">
    <div
      id="participatingOrganisations"
      className="flex flex-row flex-nowrap w-full overflow-x-scroll h-[12rem] hgf-scrollbar animate-"
    >
      {
        organisations.map(item => {
          return(
            <Link
              key={`link_${item.name}`}
              href={`/organisations/${item.rsd_path}`}
              passHref
            >
              <img
                key={item.name}
                alt={item.name}
                src={getImageUrl(item.logo_id) ?? undefined}
                className="p-10 hover:cursor-pointer"
              />
            </Link>
          )
        })
      }
      </div>
      <IconButton
        id="scrollLeftButton"
        color="primary"
        sx={{
          fontSize: '2.5rem',
          backgroundColor: 'white',
          position: 'absolute',
          transform: 'translateY(-50%)',
          top: '50%',
          left: '0px'
        }}
        onClick={moveLeft}
      >
        <ChevronLeft fontSize="inherit" />
      </IconButton>
      <IconButton
        id="scrollRightButton"
        color="primary"
        sx={{
          fontSize: '2.5rem',
          backgroundColor: 'white',
          position: 'absolute',
          top: '50%',
          right: '0px',
          transform: 'translateY(-50%)',
        }}
        onClick={moveRight}
      >
        <ChevronRight fontSize="inherit" />
      </IconButton>
    </div>
  )
}

function moveRight() {
  const container = document.getElementById('participatingOrganisations')
  if(container) {
    container.scroll({
      left: container.scrollLeft + 500,
      top: 0,
      behavior: 'smooth'
    })
  }
}

function moveLeft() {
  const container = document.getElementById('participatingOrganisations')
  if(container) {
    container.scroll({
      left: container.scrollLeft - 500,
      top: 0,
      behavior: 'smooth'
    })
  }
}

export default function HelmholtzHome() {
  const {session}=useAuth()
  const {loading,organisations} = useOrganisations(session.token)

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
     <div className="bg-white" data-testid="rsd-helmholtz-home">

        <AppHeader/>

        {/* Head and claim */}
        <div className="bg-secondary bg-landing-page mb-10">
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
        <div className="container mx-auto p-6 md:p-10 xl:py-10 xl:px-0 max-w-screen-xl text-secondary">
          <h2 className='text-5xl'>Software Spotlights</h2>
          <div className='text-2xl mt-2'>Outstanding software products of the Helmholtz community</div>
          <div className="w-full">
            <Spotlights spotlights={SPOTLIGHTS} />
            <div className="flex">
              <Link href="/software" passHref>
                <div
                  className="w-[250px] bg-[#05e5ba] hover:bg-primary text-secondary hover:text-white text-center font-medium text-2xl py-4 px-6 rounded-sm">
                  Browse software
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Software meta repository */}
        <div className="conainer mx-auto my-10 max-w-screen-xl text-white bg-secondary">
          <div
            id="backgroundContainer"
            className="w-full h-full p-12 bg-blend-multiply bg-center bg-cover bg-secondary bg-opacity-75 relative"
            onMouseLeave={clearBackgroundImage}>
            <h2 className='text-5xl'>Discover by research topic</h2>
            {/* <div className="text-xl my-4">Browse Software by Research Topic</div> */}
            <ResearchFields />
          </div>
        </div>

        {/* Teaser */}
        <div className="conainer mx-auto p-6 md:p-10 xl:py-10 xl:px-0 max-w-screen-xl text-secondary">
          <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-20'>
            <div className='text-2xl'>
              <h2 className='text-5xl pb-10'>Upcoming</h2>
              <div>This service is in <span className="bg-[#cdeefb]">active development</span>. Upcoming features include:</div>
              <div className="px-6 my-4 border-l-2 border-[#002864]">
                <div className="py-4">Login with your Helmholtz Institution&apos;s account</div>
                <div className="py-4">Add your own software products</div>
                <div className="py-4">Add related projects, funding and institutions</div>
                <div className="py-4">Obtain a free license consultation from HIFIS</div>
              </div>
              <div className="py-2">Do you have <span className="bg-[#cdeefb]">suggestions for improvements or new features</span>?</div>
              <div className="py-2">Please let us know! Send us an <a href="mailto:support@hifis.net?subject=Comments about RSD" className="bg-[#cdeefb] underline">e-mail</a>, or open an <a href="https://github.com/hifis-net/RSD-as-a-service/issues" target="_blank" className="bg-[#cdeefb] underline" rel="noreferrer">issue</a> in our GitHub repository.</div>
            </div>
            <div className="hidden md:block md:bg-[url(/images/pexels-cottonbro-5483075.jpg)] bg-center bg-cover"></div>
          </div>
        </div>

        {/* Participating organsiations */}
        <div className="container mx-auto p-6 md:p-10 xl:py-10 xl:px-0 max-w-screen-xl text-secondary">
          <div className="py-6">
            <h2 className="text-5xl">Participating organisations</h2>
            <ParticipatingOrganisations organisations={organisations}/>
          </div>
        </div>

        {/* For RSEs and Researchers */}
        {/* <div className="conainer mx-auto p-6 md:p-10 max-w-screen-xl text-secondary">
          <div className='py-6'>
            <h2 className='text-5xl'>For RSEs and Researchers</h2>
            <div className="text-2xl my-4">A place for Research Software that is being developed in the Helmholtz Association.</div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
              <div className='text-center text-2xl py-4'>
                <div className="pb-4">For Research Software Engineers</div>
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
                <div className="mb-4">For Researchers</div>
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
          </div>
        </div> */}
        <AppFooter/>
      </div>
  )
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const {req} = context
//   const token = req?.cookies['rsd_token']
//   const url = `${process.env.POSTGREST_URL}/rpc/organisations_overview?parent=is.null`
//   const {data} = await getOrganisationsList({url, token})
//   return {
//     props: {
//       organisations: data
//     }
//   }
// }
