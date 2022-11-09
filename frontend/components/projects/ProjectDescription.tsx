// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
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
        <ImageAsBackground
          src={image}
          alt={image_caption ?? 'image'}
          bgSize={image_contain ? 'contain' : 'cover'}
          bgPosition={image_contain ? 'center' : 'top center'}
          className="w-full h-[12rem] sm:h-[20rem] md:h-[25rem] lg:h-[30rem]"
        />
      )
    }
    return null
  }
  return (
    <article>
      {getImage()}
      <div className="text-sm text-grey-600 mt-2 mb-4" style={{wordBreak:'break-word'}}>{image_caption}</div>
      <ReactMarkdownWithSettings
        markdown={description}
      />
    </article>
  )
}
