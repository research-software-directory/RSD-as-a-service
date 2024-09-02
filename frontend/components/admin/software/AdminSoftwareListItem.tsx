// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import SoftwareListItemContent from '~/components/software/overview/list/SoftwareListItemContent'
import StatusBanner from '~/components/cards/StatusBanner'

type SoftwareListItemProps = {
  software:SoftwareOverviewItemProps
  onDelete: ()=>void
}

export default function AdminSoftwareListItem({software,onDelete}:SoftwareListItemProps) {
  return (
    <OverviewListItem>
      {/* standard software list item with link */}
      <Link
        data-testid="software-grid-card"
        title="Click to edit software"
        href={`/software/${software.slug}/edit/information`}
        className="flex-1 flex hover:text-inherit"
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
      </Link>

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
