// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image'
import {getImageUrl} from '~/utils/editImage'
import ImageAsBackground from '../layout/ImageAsBackground'

export default function HighlightsCardLogo({image_id}:{image_id: string}) {
  const image_url = getImageUrl(image_id)
  return (
    <ImageAsBackground
      alt='Alt'
      bgSize='contain'
      className="w-full"
      src={image_url}
    />
  )
}
