// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ReactMarkdownWithSettings from '../layout/ReactMarkdownWithSettings'


export default function AboutStatement({brand_name = '', description = ''}:
  { brand_name: string, description: string }) {

  // skip section if no brand_name
  if (brand_name==='' || description==='') return null

  return (
    <>
      <h2
        className="text-[2rem] text-primary pb-4"
        data-testid="about-statement-title"
      >
        What {brand_name} can do for you
      </h2>
      <ReactMarkdownWithSettings
        markdown={description}
      />
    </>
  )
}
