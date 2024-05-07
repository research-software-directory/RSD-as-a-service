// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
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
      data-testid="react-markdown-with-settings"
      className={`prose max-w-none prose-h1:text-3xl prose-headings:font-normal prose-code:before:hidden prose-code:after:hidden ${className ?? ''}`}
      linkTarget="_blank"
      skipHtml={true}
      remarkPlugins={plugins}
    >
      {markdown ?? ''}
    </ReactMarkdown>
  )
}
