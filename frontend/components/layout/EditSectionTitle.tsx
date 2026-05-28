// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {ElementType} from 'react'
import Link from '@mui/material/Link'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

type EditSectionTitleProps = {
  title: string,
  subtitle?: string,
  children?: any,
  hlevel?: number,
  infoLink?: {
    url: string,
    ariaLabel: string
  },
  className?: string
}

function InfoLink({infoLink}:Readonly<{infoLink:EditSectionTitleProps['infoLink']}>){

  if (!infoLink) return null

  return (
    <Link
      aria-label={infoLink.ariaLabel}
      href={infoLink.url}
      target="_blank"
      rel="noreferrer"
      className="flex"
    >
      <InfoOutlinedIcon fontSize="small"/>
    </Link>
  )
}

function SubTitle({subtitle}:Readonly<{subtitle:EditSectionTitleProps['subtitle']}>){
  if (!subtitle) return null

  return(
    <p className="mb-4"
      dangerouslySetInnerHTML={{__html: subtitle}}>
    </p>
  )
}


export default function EditSectionTitle({
  title, subtitle = '', children, hlevel = 2, infoLink, className='font-medium'
}:EditSectionTitleProps) {

  const HeadingTag = `h${hlevel}` as ElementType

  if (children){
    return (
      <>
        <div className="flex">
          <HeadingTag className={`flex-1 flex ${className ?? ''}`}>
            {title}
            <InfoLink infoLink={infoLink}/>
          </HeadingTag>
          {children}
        </div>
        <SubTitle subtitle={subtitle} />
      </>
    )
  }

  return (
    <>
      <HeadingTag className={`flex-1 flex ${className ?? ''}`}>
        {title}
        <InfoLink infoLink={infoLink}/>
      </HeadingTag>
      <SubTitle subtitle={subtitle} />
    </>
  )
}
