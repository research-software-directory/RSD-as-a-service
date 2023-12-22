// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import MainContent from './MainContent'
import ReactMarkdownWithSettings from './ReactMarkdownWithSettings'

export default function MarkdownPage({markdown}:{markdown:string}) {
  return (
    <MainContent>
      <ReactMarkdownWithSettings
        className='py-8'
        markdown={markdown}
      />
    </MainContent>
  )
}
