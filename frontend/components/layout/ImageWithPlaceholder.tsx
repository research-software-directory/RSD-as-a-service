// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'
import useValidateImageSrc from '~/utils/useValidateImageSrc'

export type ImageWithPlaceholderProps = {
  src: string | null | undefined
  alt: string,
  className?: string,
  bgSize?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
  bgPosition?: string
  placeholder?: string
  width?: string
  height?: string
  type?: 'gradient' | 'icon'
}

export default function ImageWithPlaceholder({
  src, alt, className, bgSize = 'contain', bgPosition = 'center', placeholder,
  width = '4rem', height = '4rem', type='icon'
}: ImageWithPlaceholderProps
) {
  const validImg = useValidateImageSrc(src)

  if (!src || validImg===false || src==='') {
    if (type === 'gradient') {
      return (
        <div
          className="w-full h-full bg-linear-to-br from-base-300 from-0% via-base-100 via-50% to-base-100"
        />
      )
    }
    return (
      <div
        className={`flex flex-col justify-center items-center text-base-500 rounded-xs ${className ?? ''}`}
      >
        <PhotoSizeSelectActualOutlinedIcon
          sx={{
            width,
            height
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
      // lighthouse audit requires explicit width and height
      height="100%"
      width="100%"
      style={{
        objectFit: bgSize,
        objectPosition: bgPosition
      }}
      aria-label={alt}
      alt={alt}
      className={`rounded-xs ${className ?? ''}`}
    ></img>
  )
}
