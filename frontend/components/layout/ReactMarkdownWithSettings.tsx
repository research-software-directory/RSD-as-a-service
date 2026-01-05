// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeExternalLinks from 'rehype-external-links'

export default function ReactMarkdownWithSettings({markdown, className, breaks=true}:
{markdown: string, className?: string, breaks?:boolean}) {
  // define plugins to use
  const remarkPlugins:any[] = [remarkGfm]
  // note! do not use rehype-sanitize plugin as it will remove the target
  const rehypePlugins:any[] = [[rehypeExternalLinks,{target:'_blank'}]]
  // add breaks
  if (breaks===true) remarkPlugins.push(remarkBreaks)

  return (
    <div className={`prose max-w-none prose-h1:text-3xl prose-headings:font-normal prose-code:before:hidden prose-code:after:hidden ${className ?? ''}`}>
      <ReactMarkdown
        data-testid="react-markdown-with-settings"
        skipHtml={true}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
      >
        {markdown ?? ''}
      </ReactMarkdown>
    </div>
  )
}
