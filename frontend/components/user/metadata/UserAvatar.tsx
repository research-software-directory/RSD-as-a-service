// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useSession} from '~/auth/AuthProvider'
import {deleteImage, getImageUrl, upsertImage} from '~/utils/editImage'
import {getDisplayInitials, getDisplayName} from '~/utils/getDisplayName'
import {useUserSettings} from '~/config/UserSettingsContext'
import Logo, {ImageDataProps} from '~/components/layout/Logo'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {useUserContext} from '~/components/user/context/UserContext'
import {patchUserProfile} from '~/components/user/settings/profile/apiUserProfile'

export default function UserAvatar() {
  const {token,user} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {profile,updateUserProfile} = useUserContext()
  const {setAvatarId} = useUserSettings()
  const name = getDisplayName(profile)
  const initials = getDisplayInitials(profile)
  // rsd_admin and your own profile
  const isMaintainer = user?.role==='rsd_admin' ? true : user?.account === profile?.account
  const avatar = profile?.avatar_id

  // console.group('UserAvatar')
  // console.log('avatar...', avatar)
  // console.log('name...', name)
  // console.log('isMaintainer...', isMaintainer)
  // console.log('profile...', profile)
  // console.groupEnd()

  async function addAvatar({data, mime_type}: ImageDataProps) {
    // split base64 to use only encoded content
    const b64data = data.split(',')[1]
    const resp = await upsertImage({
      data:b64data,
      mime_type,
      token
    })
    // console.log('addLogo...resp...', resp)
    if (resp.status === 201) {
      // avatar_id is returned
      const avatar_id = resp.message
      // update logo_id reference
      const patch = await patchUserProfile({
        account: profile.account,
        data: {
          avatar_id
        },
        token
      })
      if (patch.status === 200) {
        // if we are replacing existing logo
        if (avatar !== null && resp.message &&
          avatar !== resp.message
        ) {
          // try to remove old logo from db
          // do not await for result
          // NOTE! delete MUST be after patching organisation
          // because we are removing logo_id reference
          deleteImage({
            id: avatar,
            token
          })
        }
        updateUserProfile({key:'avatar_id',value:resp.message})
        // update avatar_id in the userSettings
        setAvatarId(avatar_id)
      } else {
        showErrorMessage(`Failed to upload avatar. ${resp.message}`)
      }
    } else {
      showErrorMessage(`Failed to upload avatar. ${resp.message}`)
    }
  }

  async function removeAvatar() {
    if (avatar && token && profile.account) {
      // remove logo_id from organisation
      const resp = await patchUserProfile({
        account: profile.account,
        data: {
          avatar_id: null
        },
        token
      })
      // console.log('removeLogo...',resp)
      if (resp.status === 200) {
        // delete logo without check
        deleteImage({
          id: avatar,
          token
        })
        updateUserProfile({key:'avatar_id',value:null})
        setAvatarId(null)
      } else {
        showErrorMessage(`Failed to remove avatar. ${resp.message}`)
      }
    }
  }

  return (
    <Logo
      name={name ?? ''}
      logo={avatar}
      onAddLogo={addAvatar}
      onRemoveLogo={removeAvatar}
      canEdit={isMaintainer}
      variant='circular'
      initials={initials}
      src={getImageUrl(avatar) ?? undefined}
      sx={{
        backgroundColor: avatar ? 'inherit' : 'text.disabled',
        width: '10rem',
        height: '10rem',
        'img': {
          objectFit: 'cover',
          objectPosition: 'center'
        }
      }}
    />
  )
}
