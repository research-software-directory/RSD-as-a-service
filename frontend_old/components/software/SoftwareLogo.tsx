// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import ImageWithPlaceholder from '../layout/ImageWithPlaceholder'

export default function SoftwareLogo(
  {image_id, brand_name}: {image_id:string, brand_name:string}
) {
  const image_path = getImageUrl(image_id)

  if (image_path !== null ){
    return (
      <ImageWithPlaceholder
        alt={`Logo of ${brand_name}`}
        bgSize={'contain'}
        bgPosition={'left center'}
        src={image_path}
        className="h-[9rem]"
      />
    )
  }
  // else return nothing
  return null
}
