// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function EditSectionTitle(
  {title, subtitle = '', children, hlevel = 2}:
  {title: string, subtitle?: string, children?: any, hlevel?: number}
) {

  const HeadingTag: any = `h${hlevel}`

  function getSubtitle() {
    if (subtitle) {
      return (
        <p className="mb-4"
          dangerouslySetInnerHTML={{__html: subtitle}}>
        </p>
      )
    }
  }

  if (children) {
    return (
      <>
        <div className="flex">
          <HeadingTag className="flex-1">{title}</HeadingTag>
          {children}
        </div>
        {getSubtitle()}
      </>
    )
  }

  return (
    <>
      <HeadingTag>{title}</HeadingTag>
      {getSubtitle()}
    </>
  )

}
