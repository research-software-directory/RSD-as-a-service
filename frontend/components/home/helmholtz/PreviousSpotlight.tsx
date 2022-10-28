// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
//
// SPDX-License-Identifier: EUPL-1.2

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'

export default function PreviousSpotlight({name, image, link, description, i}:
    {name: string, image: string, link: string, description: string | '', i: number}) {

    const MAX_CHARS = 150
    function descriptionParagraph (description: string) {
      if (description != '') {
        if (description.length > MAX_CHARS) {
          let description_trunc = description.substring(0, MAX_CHARS)
          description = description_trunc.substring(0, description_trunc.lastIndexOf(' ')) + ' …'
        }
        return (
          <p>{description}</p>
        )
      }
    }

    return (
      <Link
        href={link}
        passHref
      >
        <div className="w-full sm:w-1/2 md:w-1/4 max-h-[15rem] py-[1rem] flex items-center relative group hover:bg-[#ecfbfd] hover:cursor-pointer">
          <img
            alt={name}
            className="max-h-[10rem] max-w-[100%] mx-auto p-[1rem] group-hover:blur-sm group-hover:opacity-50 group-hover:grayscale"
            src={image}
          />
          <div className="hidden group-hover:block group-hover:cursor-pointer absolute bottom-[1rem] left-[1rem]">
            <h2>{name}</h2>
            {descriptionParagraph(description)}
          </div>
        </div>
      </Link>
    )
  }
