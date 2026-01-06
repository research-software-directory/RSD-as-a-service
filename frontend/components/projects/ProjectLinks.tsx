// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import {ProjectLink} from '~/types/Project'
import ProjectSidebarSection from '../layout/SidebarSection'
import ProjectSidebarTitle from '../layout/SidebarTitle'

export default function ProjectLinks({links}: {links: ProjectLink[]}) {
  if (!links || links?.length === 0) {
    return (
      <ProjectSidebarSection>
        <ProjectSidebarTitle>Project links</ProjectSidebarTitle>
        <i>Not specified</i>
      </ProjectSidebarSection>
    )
  }

  return (
    <ProjectSidebarSection>
      <ProjectSidebarTitle>Project links</ProjectSidebarTitle>
      <ul>
        {
          links.map(link => {
            if (link.url) {
              return (
                <li key={link.url} className="text-sm py-1">
                  <Link
                    href={link.url}
                    target="_blank"
                    passHref
                    className='flex gap-2 items-center'
                  >
                    <OpenInNewIcon
                      sx={{
                        width: '1rem'
                      }}
                    />

                    {link.title}

                  </Link>
                </li>
              )
            }
          })
        }
      </ul>
    </ProjectSidebarSection>
  )
}
