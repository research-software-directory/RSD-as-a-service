// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useRsdSettings from '~/config/useRsdSettings'
import MarkdownPages from './MarkdownPages'
import CustomLinks from './CustomLinks'
import OrganisationLogo from './OrganisationLogo'
import ContactEmail from './ContactEmail'

export default function AppFooter () {
  const isDev = process.env.NODE_ENV === 'development'
  const {pages,links,embedMode,host} = useRsdSettings()
  if (embedMode === true) return null

  return (
    <footer className="flex flex-wrap text-primary-content border-t bg-secondary border-base-300">
      <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-[2fr,1fr] lg:container lg:mx-auto">
        <div className="pt-8 md:py-8">
          <p className="text-lg">
            The Research Software Directory promotes the impact, re-use and citation of research software.
          </p>

          <ContactEmail email={host?.email} />
          <div className="py-4"></div>
          <OrganisationLogo host={host} />
        </div>
        <div className="pb-8 md:py-8 flex flex-col gap-2">
          <MarkdownPages pages={pages ?? []} />
          <CustomLinks links={links ?? []} />
        </div>
      </div>
    </footer>
  )
}
