// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
//
// SPDX-License-Identifier: EUPL-1.2

import React from 'react'
import Link from 'next/link'
import 'simplebar/dist/simplebar.min.css'

/*! purgecss start ignore */
import Image from 'next/image'
/*! purgecss end ignore */


export default function LatestSpotlight({name, description, image, link}:
    {name:string, description:string, image:string, link: string}) {
    return(
      <Link
      href={link}
      passHref
      >
      <div className="w-full flex flex-row flex-wrap my-5 hover:bg-[#ecfbfd] hover:cursor-pointer relative group">
        <div className="h-[20rem] md:h-[30rem] lg:h-[35rem] w-full md:w-2/3 overflow-hidden md:my-auto relative">
          <Image
            alt={name}
            layout="fill"
            objectFit='cover'
            objectPosition='50% 50%'
            className="group-hover:scale-105 transition duration-100"
            src={image}
          />
        </div>
        <div className="md:w-1/3 md:pl-8 mt-auto text-xl">
          <div className="text-4xl py-2">{name}</div>
          <p>{description}</p>
        </div>
      </div>
    </Link>
    )
  }
