// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'

type ImageAsBackgroundProps = {
  src: string | null | undefined
  alt: string,
  className: string,
  bgSize?: string,
  bgPosition?: string
  noImgMsg?: string
}

export default function ImageAsBackground(
  {src, alt, className, bgSize = 'cover', bgPosition = 'center center',
    noImgMsg = 'no image avaliable'}: ImageAsBackgroundProps
) {

  if (!src) {
    return (
      <div
        data-testid="image-as-background"
        className={`${className} flex flex-col justify-center items-center text-base-300 rounded-xs`}
      >
        <PhotoSizeSelectActualOutlinedIcon
          sx={{
            width: '4rem',
            height: '4rem'
          }}
        />
        <div className="uppercase text-center">{noImgMsg}</div>
      </div>
    )
  }
  return (
    <div
      data-testid="image-as-background"
      role="img"
      style={{
        flex: 1,
        backgroundImage: `url('${src}')`,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
        backgroundRepeat: 'no-repeat',
      }}
      aria-label={alt}
      className={`${className} rounded-xs`}
    ></div>
  )
}
