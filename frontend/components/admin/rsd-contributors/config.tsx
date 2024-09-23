// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import LaunchIcon from '@mui/icons-material/Launch'

import {Column} from '~/components/table/EditableTable'
import {patchPerson} from './apiRsdContributors'
import {RsdContributor} from './useContributors'
import AvatarOptions from './AvatarOptions'

export function createColumns(token: string) {
  const columns: Column<RsdContributor, keyof RsdContributor>[] = [{
    key: 'avatar_id',
    label: 'Avatars *',
    type: 'custom',
    sx: {
      width: '4rem',
      padding: '0.5rem',
      textAlign: 'center'
    },
    renderFn: (data) => <AvatarOptions data={data} />
  }, {
    key: 'given_names',
    label: 'Given names',
    type: 'string',
    sx: {
      width: '7rem',
      padding: '0.5rem'
    },
    patchFn: async (props) => patchPerson({
      ...props,
      token
    })
  }, {
    key: 'family_names',
    label: 'Family names',
    type: 'string',
    sx: {
      width: '7rem',
      padding: '0.5rem'
    },
    patchFn: async (props) => patchPerson({
      ...props,
      token
    })
  }, {
    key: 'email_address',
    label: 'Email',
    type: 'string',
    sx: {
      width: '6rem',
      padding: '0.5rem'
    },
    patchFn: async (props) => patchPerson({
      ...props,
      token
    })
  }, {
    key: 'role',
    label: 'Role',
    type: 'string',
    sx: {
      width: '9rem',
      padding: '0.5rem'
    },
    patchFn: async (props) => patchPerson({
      ...props,
      token
    })
  }, {
    key: 'affiliation',
    label: 'Affiliation',
    type: 'string',
    sx: {
      width: '9rem',
      padding: '0.5rem'
    },
    patchFn: async (props) => patchPerson({
      ...props,
      token
    })
  }, {
    key: 'orcid',
    label: 'ORCID',
    type: 'string',
    sx: {
      width: '11rem',
      padding: '0.5rem'
    },
    patchFn: async (props) => patchPerson({
      ...props,
      token
    })
  }, {
    key: 'slug',
    label: 'Location',
    type: 'custom',
    sx: {
      padding: '0.5rem',
      width: '5rem',
    },
    renderFn: (data) => {
      // software by default
      let url=`/software/${data.slug}/edit/contributors`
      if (data.origin === 'team_member') {
        url=`/projects/${data.slug}/edit/team`
      }
      return (
        <a href={url} target="_blank" rel="noreferrer">
          <LaunchIcon sx={{marginRight:'0.25rem'}} fontSize="small"/>
        </a>
      )
    }
  }]

  return columns
}
