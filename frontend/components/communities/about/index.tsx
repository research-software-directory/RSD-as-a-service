// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'

export default function AboutCommunity({description}:Readonly<{description?:string|null}>) {
  // if description is present we return markdown page
  if (description) {
    return (
      <BaseSurfaceRounded
        className="flex-1 mb-12 p-4 flex justify-center"
        type="div"
      >
        {description ?
          <ReactMarkdownWithSettings
            className="pt-4"
            markdown={description}
          />
          : null
        }
      </BaseSurfaceRounded>
    )
  }
  return notFound()
}
