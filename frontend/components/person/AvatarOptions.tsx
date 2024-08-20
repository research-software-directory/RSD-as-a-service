// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent} from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'

import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import ImageInput from '~/components/form/ImageInput'

type AvatarOptionsProps = {
  given_names: string
  family_names: string
  avatar_id: string | null
  avatar_b64: string | null
  avatar_options: string[]
  onSelectAvatar: (avatar_id:string)=>void
  onNoAvatar:()=>void
  onFileUpload:(e:ChangeEvent<HTMLInputElement>|undefined)=>void
}

export default function AvatarOptions(props: AvatarOptionsProps) {
  const {given_names, family_names, avatar_id, avatar_b64, avatar_options} = props
  const {onFileUpload, onNoAvatar, onSelectAvatar} = props
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <label htmlFor="upload-avatar-image"
          title="Click to upload new image"
          style={{
            display: 'flex',
            cursor: 'pointer',
            padding: '0.5rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Avatar
            alt={getDisplayName({given_names, family_names}) ?? 'Unknown'}
            src={avatar_b64 ?? getImageUrl(avatar_id) ?? ''}
            sx={{
              width: '8rem',
              height: '8rem',
              fontSize: '3rem',
              margin: '1rem'
            }}
          >
            {getDisplayInitials({given_names, family_names}) ?? ''}
          </Avatar>
        </label>
        <ImageInput
          data-testid="upload-avatar-input"
          id="upload-avatar-image"
          onChange={onFileUpload}
        />
      </div>
      <div>
        <h3 className="text-sm text-base-content-disabled pb-4">Avatar options</h3>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems:'flex-start',
            justifyContent: 'flex-start',
            gap:'0.25rem',
            maxHeight: '10rem',
            overflow: 'auto'
          }}
        >
          {avatar_options.map(img => {
            return (
              <IconButton
                title="Use this image"
                key={img}
                onClick={()=>onSelectAvatar(img)}
              >
                <img
                  src={getImageUrl(img) ?? ''}
                  alt="avatar"
                  className="w-[2.5rem] h-[2.5rem] rounded-full"
                />
              </IconButton>
            )
          })}
          <IconButton
            title="No image"
            onClick={onNoAvatar}
          >
            {getDisplayInitials({given_names, family_names})}
          </IconButton>
        </Box>
      </div>
    </div>
  )
}
