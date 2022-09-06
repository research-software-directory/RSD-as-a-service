// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: EUPL-1.2

import Link from 'next/link'
import LogoEscience from '~/components/svg/LogoEscience'
import Mail from '@mui/icons-material/Mail'
import useRsdSettings from '~/config/useRsdSettings'
import LogoHifis from '~/assets/logos/LogoHIFISWhite.svg'
import LogoGithub from '~/assets/logos/github-icon.svg'

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

        <div className="flex flex-col justify-between pt-10 sm:pb-10">
          <div className="text-lg mb-4">
            <a target="_blank" href="https://hifis.net" rel="noreferrer"
              className="hover:text-primary"
            >
              <LogoHifis />
            </a>
          </div>
          <div className="text-lg mb-4">
            This page is based on the Research Software Directory by
            <div>
              <a target="_blank" href="https://esciencecenter.nl" rel="noreferrer"
                className="hover:text-primary"
              >
                <LogoEscience />
              </a>
            </div>
            {/* Please use our tools!&nbsp;<Link href="/about" passHref>
              <a className="mr-2 underline">Read more</a>
            </Link> */}
          </div>
          <div className="text-l">
            Contribute on
            <a target="_blank" href="https://github.com/hifis-net/RSD-as-a-service" rel="noreferrer"
              className="hover:text-primary inline-block align-middle"
            >
              <div className="ml-2 inline-block">
                  <LogoGithub />
              </div>
            </a>
            {/* Please use our tools!&nbsp;<Link href="/about" passHref>
              <a className="mr-2 underline">Read more</a>
            </Link> */}
          </div>
          {/* <div className="mt-4 text-sm">Copyright © {new Date().getFullYear()}</div> */}
        </div>

        <div className="pb-10 sm:pt-10">
          <div className="text-lg">Questions or comments?</div>
          <a href="mailto:support@hifis.net"
             className="flex mt-2 text-primary hover:text-white"
          >
            <Mail className="mr-2"/> support@hifis.net
          </a>
          <div className="text-lg">Research Software Directory</div>
          <div className="flex flex-col">
            {renderLinks()}
            <Link
              key="cookie_settings"
              href={'/cookies'} passHref>
              <a className="hover:text-primary">Cookie settings</a>
            </Link>
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
            <a href="https://www.gfz-potsdam.de/en/data-protection/"
              target="_blank"
              className="footer-link"
              rel="noreferrer">
              Data protection declaration
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
