// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
//
// SPDX-License-Identifier: EUPL-1.2

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import ResearchField from './ResearchField'

const RESEARCH_FIELDS = [
    {key: 1, name: 'Energy', img: '/images/pexels-pixabay-414837.jpg'},
    {key: 2, name: 'Earth & Environment', img: '/images/pexels-blue-ox-studio-695299.jpg'},
    {key: 3, name: 'Health', img: '/images/pexels-rfstudio-3825529.jpg'},
    {key: 4, name: 'Information', img: '/images/jj-ying-8bghKxNU1j0-unsplash.jpg'},
    {key: 5, name: 'Aeronautics, Space and Transport', img: '/images/pexels-aleksejs-bergmanis-681335.jpg'},
    {key: 6, name: 'Matter', img: '/images/desy_yulia-buchatskaya-hYvZHggmuc4-unsplash.jpg'},
  ]

export default function ResearchFieldCollection() {
    return (
      <div id="researchTopicBox" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 md:gap-y-20 text-center text-3xl place-items-center py-16">
        {
          RESEARCH_FIELDS.map(item => {
            return(
              <ResearchField key={`researchfield-${item.key}`} background={item.img} name={item.name} />
            )
          })
        }
      </div>
    )
  }
