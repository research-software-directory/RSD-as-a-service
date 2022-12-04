// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

export default function ReactMarkdownWithSettings({markdown, className, breaks=true}:
  { markdown: string, className?: string, breaks?:boolean }) {
  // define plugins to use
  const plugins = [remarkGfm]
  // add breaks
  if (breaks===true) plugins.push(remarkBreaks)

  return (
    <ReactMarkdown
      className={`prose max-w-none prose-h1:text-3xl prose-headings:font-normal ${className ?? ''}`}
      linkTarget="_blank"
      skipHtml={true}
      remarkPlugins={plugins}
    >
      {markdown ?? ''}
    </ReactMarkdown>
  )
}
