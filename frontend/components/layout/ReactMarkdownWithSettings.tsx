// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ReactMarkdownWithSettings({markdown, className}:{markdown:string, className?:string}) {
  return (
    <ReactMarkdown
      className={`prose ${className ?? ''}`}
      linkTarget="_blank"
      skipHtml={true}
      remarkPlugins={[remarkGfm]}
    >
      {markdown ?? ''}
    </ReactMarkdown>
  )
}
