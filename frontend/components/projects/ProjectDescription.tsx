// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '../../utils/getProjects'
import ImageAsBackground from '../layout/ImageAsBackground'
import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'


type ProjectInfoProps = {
  image_id: string | null
  image_caption: string | null
  description: string
}

export default function ProjectDescription({image_id,image_caption,description}:ProjectInfoProps) {
  const image = getImageUrl(image_id)

  function getImage() {
    if (image) {
      return (
        <ImageAsBackground
          src={image}
          alt={image_caption ?? 'image'}
          className="w-full h-[30rem]"
        />
      )
    }
    return null
  }
  return (
    <article>
      {getImage()}
      <div className="text-sm text-grey-600 mt-2 mb-4">{image_caption}</div>
      <ReactMarkdownWithSettings
        markdown={description}
      />
    </article>
  )
}
