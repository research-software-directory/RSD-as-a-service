// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useValidateImageSrc from '~/utils/useValidateImageSrc'

export default function ListImageWithGradientPlaceholder({imgSrc,alt}:{imgSrc:string|null, alt:string|null}) {
  const validImg = useValidateImageSrc(imgSrc)

  // console.group('ListItemImageWithGradientPlaceholder')
  // console.log('imgSrc...', imgSrc)
  // console.log('validImg...', validImg)
  // console.groupEnd()

  if (validImg === false || imgSrc === null){
    // return gradient square as placeholder
    return (
      <div
        className="w-[6rem] min-h-[4rem] self-stretch bg-linear-to-br from-base-300 from-0% via-base-100 via-50% to-base-100"
      />
    )
  }

  return (
    <img
      src={`${imgSrc ?? ''}`}
      alt={alt ?? 'Image'}
      className="w-[6rem] max-h-[4rem] self-center text-base-content-disabled p-2 object-contain object-center"
      // lighthouse audit requires explicit width and height
      height="2.5rem"
      width="100%"
    />
  )
}
