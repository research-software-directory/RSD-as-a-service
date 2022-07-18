// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import LogoEscience from '~/components/svg/LogoEscience'
import Mail from '@mui/icons-material/Mail'
import useRsdSettings from '~/config/useRsdSettings'

export default function AppFooter () {
  const isDev = process.env.NODE_ENV === 'development'
  const {links,embedMode} = useRsdSettings()
  if (embedMode === true) return null

  function renderLinks() {
    return links.map(page => {
      return (
        <Link
          key={page.slug}
          href={`/page/${page.slug}`} passHref>
          <a className="hover:text-primary">{page.title}</a>
        </Link>
      )
    })
  }

  return (
    <footer className="flex flex-wrap text-white border-t bg-secondary border-grey-A400">
      <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-[_2fr,1fr] lg:container lg:mx-auto">

        <div className="pt-10 sm:pb-10">
          <div className="mb-4 text-lg">
            The Research Software Directory aims to promote the impact,
            the exchange and re-use of research software.
            {/* Please use our tools!&nbsp;<Link href="/about" passHref>
              <a className="mr-2 underline">Read more</a>
            </Link> */}
          </div>
          <a target="_blank" href="https://esciencecenter.nl" rel="noreferrer"
            className="hover:text-primary"
          >
            <LogoEscience />
          </a>
          {/* <div className="mt-4 text-sm">Copyright © {new Date().getFullYear()}</div> */}
        </div>

        <div className="pb-10 sm:pt-10">
          <div className="text-lg">Questions or comments?</div>
          <a href="mailto:rsd@esciencecenter.nl"
             className="flex mt-2 text-primary hover:text-white"
          >
            <Mail className="mr-2"/> rsd@esciencecenter.nl
          </a>

          <div className="mt-8 text-lg">Research Software Directory</div>
          <div className="flex flex-col">
            {renderLinks()}
            <a href='https://research-software-directory.github.io/documentation'
              target="_blank"
              className="hover:text-primary"
              rel="noreferrer">
              Documentation
            </a>
              <a href={isDev ? 'http://localhost:3030' : 'https://research-software-directory.github.io/RSD-as-a-service'}
              target="_blank"
              className="hover:text-primary"
              rel="noreferrer">
              Technical Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
