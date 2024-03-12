// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import Link from '@mui/material/Link'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

type EditSectionTitleProps = {
  title: string,
  subtitle?: string,
  children?: any,
  hlevel?: number,
  infoLink?: string,
  className?: string
}

export default function EditSectionTitle({title, subtitle = '', children, hlevel = 2, infoLink, className='font-medium'}:EditSectionTitleProps) {

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
          <HeadingTag className={`flex-1 ${className ?? ''}`}>{title} {infoLink && <Link href={infoLink} target="_blank" rel="noreferrer"><InfoOutlinedIcon fontSize="small"/></Link>}</HeadingTag>
          {children}
        </div>
        {getSubtitle()}
      </>
    )
  }

  return (
    <>
      <HeadingTag className={`${className ?? ''}`}>{title} {infoLink && <Link href={infoLink} target="_blank" rel="noreferrer"><InfoOutlinedIcon fontSize="small"/></Link>}</HeadingTag>
      {getSubtitle()}
    </>
  )

}
