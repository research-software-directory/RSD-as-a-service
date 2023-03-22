// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItemText from '@mui/material/ListItemText'
import SortableListItem from '~/components/layout/SortableListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'

import {PackageManager, packageManagerSettings} from './apiPackageManager'

type PackageManagerItemProps = {
  pos: number,
  item: PackageManager,
  onDelete: (pos:number) => void
  onEdit?: (pos:number) => void
}

export default function PackageManagerItem({pos, item, onDelete, onEdit}: PackageManagerItemProps) {
  // get package manager info
  const info = packageManagerSettings[item.package_manager ?? 'other']

  return (
    <SortableListItem
      key={item.id}
      pos={pos}
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      sx={{
        '&:hover': {
          backgroundColor:'grey.100'
        },
      }}
    >
      <ListItemAvatar>
        <Avatar
          variant="square"
          src={info.icon ?? ''}
          sx={{
            width: '4rem',
            height: '4rem',
            '& img': {
              objectFit: 'contain'
            }
          }}
        >
          {info.name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={info.name}
        secondary={
          <>
            <span>{item.url}</span><br />
            {item.download_count_scraped_at ?
              <span>Downloads: {item.download_count ?? 0}</span>
              : <span>Downloads: no info</span>
            }
            {
              item.reverse_dependency_count_scraped_at ?
                <span className="ml-4">Dependencies: {item.reverse_dependencies_count ?? 0}</span>
              : <span className="ml-4">Dependencies: no info</span>
            }
          </>
        }
        sx={{
          padding:'0rem 1rem'
        }}
      />
    </SortableListItem>
  )
}
