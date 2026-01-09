// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareOfOrganisation} from '~/types/Organisation'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import StatusBanner from '~/components/cards/StatusBanner'
import {useSoftwareCardActions} from '~/components/organisation/software/card/useSoftwareCardActions'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'

type AdminSoftwareListItem = {
  item: SoftwareOfOrganisation
}

export default function AdminSoftwareListItem({item:software}: AdminSoftwareListItem) {
  const {menuOptions, onAction} = useSoftwareCardActions({software})

  return (
    <OverviewListItem>
      {/* standard software list item with link */}
      <OverviewListItemLink
        href={`/software/${software.slug}`}
      >
        <SoftwareListItemContent
          statusBanner={
            <StatusBanner
              status={software.status}
              is_featured={software.is_featured}
              is_published={software.is_published}
              width='auto'
              borderRadius='0.125rem'
            />
          }
          {...software}
        />
      </OverviewListItemLink>
      {/* admin menu */}
      <div className="flex mx-2">
        <div className="flex items-center gap-2 mx-1">

        </div>
        <IconBtnMenuOnAction
          options={menuOptions}
          onAction={onAction}
        />
      </div>
    </OverviewListItem>
  )
}
