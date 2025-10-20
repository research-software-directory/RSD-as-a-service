// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import {KeyboardDoubleArrowRight} from '@mui/icons-material'
import ContentContainer from '~/components/layout/ContentContainer'
import {SoftwareHighlight} from '~/components/admin/software-highlights/apiSoftwareHighlights'
import {HighlightsCarousel} from './highlights/HighlightsCarousel'

type SoftwareHighlightsProps=Readonly<{
  title: string,
  page: number
  highlights: SoftwareHighlight[]
}>

export default function SoftwareHighlights({title,page,highlights}:SoftwareHighlightsProps) {
  // console.group('SoftwareHighlights')
  // console.log('loading...', loading)
  // console.log('highlights...', highlights)
  // console.groupEnd()
  // const {host} = useRsdSettings()
  // const router = useRouter()

  // if there are no highlights we do not show this section
  if (highlights.length===0) return null

  // show carousel only on first page
  if (page > 1) return null

  return (
    <section className="mt-8 hide-on-no-script">
      {/* title should be in the container */}
      <div className="text-3xl px-4 lg:container lg:mx-auto">
        {title}
      </div>

      <HighlightsCarousel items={highlights} />

      <ContentContainer className='flex justify-end'>
        <Button
          variant='contained'
          href='/spotlights?order=position'
          endIcon={<KeyboardDoubleArrowRight />}
          sx={{
            backgroundColor: 'primary.main',
            marginLeft: 'auto',
            ':hover': {
              color: '#fff'
            }
          }}
        >
          Browse all Highlights
        </Button>
      </ContentContainer>
    </section>
  )
}
