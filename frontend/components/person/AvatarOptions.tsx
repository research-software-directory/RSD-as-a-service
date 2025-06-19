// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent} from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'

import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import ImageInput from '~/components/form/ImageInput'
import ContentLoader from '../layout/ContentLoader'
import ImageDropZone from '~/components/form/ImageDropZone'

type AvatarOptionsProps = {
  given_names: string
  family_names: string
  avatar_id: string | null
  avatar_options: string[]
  onSelectAvatar: (avatar_id:string)=>void
  onNoAvatar:()=>void
  onFileUpload:(e: ChangeEvent<HTMLInputElement> | {target: {files: FileList | Blob[]}} | undefined)=>void
  loading: boolean
}

export default function AvatarOptions(props: AvatarOptionsProps) {
  const {given_names, family_names, avatar_id, avatar_options, loading} = props
  const {onFileUpload, onNoAvatar, onSelectAvatar} = props

  let avatar:string|undefined
  if (avatar_id){
    if (avatar_id?.startsWith('data:')===true){
      avatar = avatar_id
    }else{
      avatar = getImageUrl(avatar_id) ?? undefined
    }
  }

  // console.group('AvatarOptions')
  // console.log('avatar_id...', avatar_id)
  // console.log('avatar_b64...', avatar_b64)
  // console.log('avatar...', avatar)
  // console.groupEnd()

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-4">
      <div>
        <ImageDropZone onImageDrop={onFileUpload}>
          <label htmlFor="upload-avatar-image"
            title="Click or drop to upload new image"
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
              src={avatar}
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
        </ImageDropZone>
        <ImageInput
          data-testid="upload-avatar-input"
          id="upload-avatar-image"
          onChange={onFileUpload}
        />
      </div>
      <div>
        <h3 className="text-sm text-base-content-disabled pb-4">Avatar options</h3>
        {loading ?
          <div className="flex h-24">
            <ContentLoader />
          </div>
          :
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
              let image = img
              if (img.startsWith('data:')===false){
                image = getImageUrl(img) ?? ''
              }
              return (
                <IconButton
                  title="Use this image"
                  key={img}
                  onClick={()=>onSelectAvatar(img)}
                >
                  <img
                    src={image}
                    alt="avatar"
                    className="w-[2.5rem] h-[2.5rem] rounded-full object-cover"
                  />
                </IconButton>
              )
            })}
            <IconButton
              data-testid="no-image-btn"
              title="No image"
              onClick={onNoAvatar}
            >
              <span className="w-[2.5rem] h-[2.5rem] rounded-full object-cover">
                {getDisplayInitials({given_names, family_names})}
              </span>
            </IconButton>
          </Box>
        }
      </div>
    </div>
  )
}
