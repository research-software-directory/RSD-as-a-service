// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import useRsdSettings from '~/config/useRsdSettings'
import MarkdownPages from './MarkdownPages'
import CustomLinks from './CustomLinks'
import OrganisationLogo from './OrganisationLogo'
import ContactEmail from './ContactEmail'

export default function AppFooter () {
  const {pages,links,host} = useRsdSettings()

  return (
    <footer className="flex flex-wrap text-primary-content border-t bg-secondary border-base-300">
      <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-[2fr_1fr] lg:container lg:mx-auto">
        <div className="pt-8 md:py-8">
          <p className="text-lg">
            The Research Software Directory promotes the impact, re-use and citation of research software.
          </p>

          <ContactEmail email={host?.email} headers={host?.emailHeaders} />
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
