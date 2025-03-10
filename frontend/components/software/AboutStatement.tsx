// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'

type AboutStatementProps = {
  brand_name: string,
  description: string,
  description_type?: 'link' | 'markdown'
}

export default function AboutStatement({brand_name = '', description = '', description_type='markdown'}:AboutStatementProps) {

  // skip section if no brand_name
  if (brand_name==='' || description==='') return null

  return (
    <>
      <h2
        className="text-[2rem] text-primary pb-4"
        data-testid="about-statement-title"
      >
        Description
      </h2>
      <ReactMarkdownWithSettings
        markdown={description}
        breaks={description_type==='markdown'}
      />
    </>
  )
}
