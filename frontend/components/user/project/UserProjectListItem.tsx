// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import StatusBanner from '~/components/cards/StatusBanner'
import {ProjectByMaintainer} from './useUserProjects'
import useUserProjectActions from './useUserProjectActions'


export default function UserProjectListItem({item}:Readonly<{item:ProjectByMaintainer}>) {
  const {project,menuOptions, onAction} = useUserProjectActions({item})

  // console.group('UserProjectListItem')
  // console.log('id...', project.id)
  // console.log('is_published...', project.is_published)
  // console.log('status...', project.status)
  // console.groupEnd()

  return (
    <OverviewListItem>
      {/* standard project list item with link */}
      <Link
        data-testid="admin-project-list-item"
        key={project.id}
        href={`/projects/${project.slug}`}
        className='flex-1 flex hover:text-inherit'
      >
        <ProjectListItemContent
          statusBanner={
            <StatusBanner
              status="approved"
              is_featured={false}
              is_published={project.is_published}
              width='auto'
              borderRadius='0.125rem'
            />
          }
          {...project}
        />
      </Link>
      {/* admin menu */}
      <div className="flex mx-2">
        <IconBtnMenuOnAction
          options={menuOptions}
          onAction={onAction}
        />
      </div>
    </OverviewListItem>
  )
}
