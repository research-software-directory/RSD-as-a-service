// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '../../utils/editImage'
import ImageAsBackground from '../layout/ImageAsBackground'
import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'


type ProjectInfoProps = {
  image_id: string | null,
  image_caption: string | null,
  image_contain: boolean,
  description: string,
}

export default function ProjectDescription(
  {image_id, image_caption, image_contain, description}: ProjectInfoProps
) {
  const image = getImageUrl(image_id)

  function getImage() {
    if (image) {
      return (
        <>
          <ImageAsBackground
            src={image}
            alt={image_caption ?? 'image'}
            bgSize={image_contain ? 'contain' : 'cover'}
            className="w-full h-[12rem] sm:h-[20rem] md:h-[25rem] lg:h-[30rem]"
          />
          <div className="text-sm text-base-600 mt-2 mb-4"
            style={{wordBreak: 'break-word'}}>
            {image_caption}
          </div>
        </>
      )
    }
    return null
  }
  return (
    <article className="mb-4 overflow-hidden">
      {getImage()}
      <ReactMarkdownWithSettings
        markdown={description}
      />
    </article>
  )
}
