// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {ProjectLink} from '../../types/Project'

export default function ProjectLinks({links}: { links: ProjectLink[] }) {
  if (!links || links?.length === 0) {
    return (
      <div>
        <div className="text-primary py-4">Project links</div>
        <i>Not specified</i>
      </div>
    )
  }

  return (
    <div>
      <div className="text-primary py-4">Project links</div>
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
                >

                  {link.title}

                </Link>
              </li>
            )
          }
        })
      }
      </ul>
    </div>
  )
}
