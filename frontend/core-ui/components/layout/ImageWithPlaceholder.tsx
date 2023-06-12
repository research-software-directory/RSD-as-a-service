// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @next/next/no-img-element */
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'

export type ImageWithPlaceholderProps = {
  src: string | null | undefined
  alt: string,
  className?: string,
  bgSize?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
  bgPosition?: string
  placeholder?: string
}

export default function ImageWithPlaceholder({
  src, alt, className, bgSize = 'contain', bgPosition = 'center', placeholder
}: ImageWithPlaceholderProps
) {

  if (!src) {
    return (
      <div
        className={`flex flex-col justify-center items-center text-grey-500 rounded-sm ${className ?? ''}`}
      >
        <PhotoSizeSelectActualOutlinedIcon
          sx={{
            width: '4rem',
            height: '4rem'
          }}
        />
        <div className="uppercase text-center">{placeholder}</div>
      </div>
    )
  }

  return (
    <img
      title={placeholder ?? alt}
      role="img"
      src={src}
      style={{
        objectFit: bgSize,
        objectPosition: bgPosition
      }}
      aria-label={alt}
      alt={alt}
      className={`rounded-sm ${className ?? ''}`}
    ></img>
  )
}
