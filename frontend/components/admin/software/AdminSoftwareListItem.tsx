// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import StatusBanner from '~/components/cards/StatusBanner'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'

type SoftwareListItemProps = {
  software:SoftwareOverviewItemProps
  onDelete: ()=>void
}

export default function AdminSoftwareListItem({software,onDelete}:SoftwareListItemProps) {
  return (
    <OverviewListItem>
      {/* standard software list item with link */}
      <OverviewListItemLink
        href={`/software/${software.slug}/edit/information`}
      >
        <SoftwareListItemContent
          statusBanner={
            <StatusBanner
              status={'approved'}
              is_featured={false}
              is_published={software.is_published}
              width='auto'
              borderRadius='0.125rem'
            />
          }
          {...software}
        />
      </OverviewListItemLink>
      {/* admin menu */}
      <div className="flex mx-4">
        <IconButton
          title = "Delete software"
          edge="end"
          aria-label="delete"
          onClick={onDelete}
          sx={{margin: '0rem'}}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </OverviewListItem>
  )
}
