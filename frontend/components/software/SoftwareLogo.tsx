// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {DesignServices} from '@mui/icons-material'
import Image from 'next/image'
import {getImageUrl} from '~/utils/editImage'
import ImageAsBackground from '../layout/ImageAsBackground'

export default function SoftwareLogo(
    {image_id, brand_name}: {image_id:string, brand_name:string}
  ) {
  const image_path = getImageUrl(image_id)

  if (image_path !== null ){
    return (
      <div className="pt-8 pb-2">
        <DesignServices color='primary' />
        <span className="text-primary pl-2">Logo</span>
        <div className="relative w-full">
          {/*Temporarily disable check until we find a better solution*/}
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={image_path}
            alt={'Logo of ' + brand_name}
            className={'w-full pt-10'}
          />
          {/* <Image
            alt={'Logo of ' + brand_name}
            src={image_path}
            fill={true}
            objectFit={'contain'}
          /> */}
        {/* <ImageAsBackground
          alt={'Logo of' + brand_name}
          bgSize={'contain'}
          bgPosition={'bottom center'}
          src={image_path}
          className="pt-10 pr-4"
        /> */}
        </div>
      </div>
    )
  } else {
    return (
      <div>Image not found</div>
    )
  }
}
