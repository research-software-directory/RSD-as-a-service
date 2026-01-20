// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import ProjectCardContent from '~/components/projects/overview/cards/ProjectCardContent'
import StatusBanner from '~/components/cards/StatusBanner'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import useUserProjectActions from './useUserProjectActions'
import {ProjectByMaintainer} from './useUserProjects'


export default function UserProjectGridCard({item}:Readonly<{item:ProjectByMaintainer}>) {
  const {project,menuOptions, onAction} = useUserProjectActions({item})

  // console.group('UserProjectGridCard')
  // console.log('refresh...', refresh)
  // console.log('id...', project.id)
  // console.log('is_published...', project.is_published)
  // console.log('status...', project.status)
  // console.groupEnd()

  return (
    <div
      data-testid="admin-project-grid-card"
      className="relative h-full"
    >
      {/* standard project card with link */}
      <Link
        data-testid="project-grid-card"
        href={`/projects/${project.slug}`}
        className="h-full hover:text-inherit"
      >
        <ProjectCardContent
          visibleKeywords={3}
          {...project}
        />
      </Link>

      {/* menu and status icons - at the top of the card */}
      <div className="w-full flex items-start absolute top-0 pt-2 pr-2 opacity-50 hover:opacity-100 z-10">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-start gap-1 pt-2 text-xs">
            <StatusBanner
              status="approved"
              is_featured={false}
              is_published={project.is_published}
              borderRadius='0 0.75rem 0.75rem 0'
            />
          </div>
        </div>
        <div className="bg-base-100 rounded-[50%]">
          <IconBtnMenuOnAction
            options={menuOptions}
            onAction={onAction}
          />
        </div>
      </div>
    </div>
  )
}
