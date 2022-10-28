// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
//
// SPDX-License-Identifier: EUPL-1.2

import LatestSpotlight from '~/components/home/helmholtz/LatestSpotlight'

type SpotlightDescription = {
    name: string,
    description: string,
    image: string,
    link: string
  }

export default function SpotlightSection({spotlights}:{spotlights: Array<SpotlightDescription>}) {
    let i = 0
    return (
      <div className="w-full">
        <LatestSpotlight
          name={spotlights[0].name}
          description={spotlights[0].description}
          image={spotlights[0].image}
          link={spotlights[0].link}
        />
        {/* <div className="w-full flex flex-row flex-wrap py-5">
          {spotlights.slice(1, 5).map(spotlight => {
            i++
            let key = 'spotlight_' + i
            return(
              <PreviousSpotlight
                key={key}
                name={spotlight.name}
                image={spotlight.image}
                link={spotlight.link}
                description={spotlight.description}
                i={i}
              />
            )
          })}
        </div> */}
      </div>
    )
  }
