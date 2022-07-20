// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

export default function ReactMarkdownWithSettings({markdown, className}:{markdown:string, className?:string}) {
  return (
    <ReactMarkdown
      className={`prose max-w-none prose-h1:text-3xl prose-headings:font-normal ${className ?? ''}`}
      linkTarget="_blank"
      skipHtml={true}
      remarkPlugins={[remarkGfm,remarkBreaks]}
    >
      {markdown ?? ''}
    </ReactMarkdown>
  )
}
