// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectOfOrganisation} from '~/types/Organisation'
import StatusBanner from '~/components/cards/StatusBanner'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import {useProjectCardActions} from '~/components/organisation/projects/card/useProjectCardActions'
import ProjectListItemContent from '~/components/projects/overview/list/ProjectListItemContent'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'

type AdminProjectListItem = {
  item: ProjectOfOrganisation
}

export default function AdminProjectListItem({item:project}: AdminProjectListItem) {
  const {onAction, menuOptions} = useProjectCardActions({project})

  // console.group('AdminProjectListItem')
  // console.log('refresh...', refresh)
  // console.log('id...', project.id)
  // console.log('is_published...', project.is_published)
  // console.log('status...', project.status)
  // console.groupEnd()

  return (
    <OverviewListItem>
      {/* standard project list item with link */}
      <OverviewListItemLink
        href={`/projects/${project.slug}`}
      >
        <ProjectListItemContent
          statusBanner={
            <StatusBanner
              status={project.status}
              is_featured={project.is_featured}
              is_published={project.is_published}
              width='auto'
              borderRadius='0.125rem'
            />
          }
          {...project}
        />
      </OverviewListItemLink>
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
