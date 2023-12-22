// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
        className="w-12 self-stretch bg-gradient-to-br from-base-300 from-0% via-base-100 via-50% to-base-100"
      />
    )
  }

  return (
    <img
      src={`${imgSrc ?? ''}`}
      alt={alt ?? 'Image'}
      className="w-12 max-h-[3.5rem] text-base-content-disabled p-2 object-contain object-center"
      // lighthouse audit requires explicit width and height
      height="2.5rem"
      width="100%"
    />
  )
}
