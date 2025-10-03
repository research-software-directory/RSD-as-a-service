// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Jesus Garcia Gonzalez (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {UIEventHandler, useRef, useState, useEffect} from 'react'
import Skeleton from '@mui/material/Skeleton'
import {SoftwareHighlight} from '~/components/admin/software-highlights/apiSoftwareHighlights'
import LeftButton from './LeftButton'
import RightButton from './RightButton'
import HighlightsCard from './HighlightsCard'

export const HighlightsCarousel = ({items=[]}: {items:SoftwareHighlight[]}) => {
  // card size + margin
  const cardMovement: number = 680
  const divRef =useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState<number>()
  // Keep track of the current scroll position of the carousel.
  const [scrollPosition, setScrollPosition] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  // console.group('HighlightsCarousel')
  // console.log('distance...',distance)
  // console.log('scrollPosition...', scrollPosition)
  // console.groupEnd()

  useEffect(() => {
    const calculateDistance = () => {
      const rect = divRef.current?.getBoundingClientRect()
      setDistance(Math.ceil(rect?.left ?? 0) + 16)
    }
    if (typeof window !== 'undefined') {
      calculateDistance()
      window.addEventListener('resize', calculateDistance)
      return () => window.removeEventListener('resize', calculateDistance)
    }
  }, [divRef])

  // Event handlers for the next and previous buttons.
  const handleNextClick = () => {
    // move the scroll to the left
    if (carousel.current) {
      carousel.current.scrollLeft += cardMovement
    }
  }

  const handlePrevClick = () => {
    if (carousel.current) {
      carousel.current.scrollLeft -= cardMovement
    }
  }

  const handleScroll:UIEventHandler<HTMLDivElement> = (event:any) => {
    // Update the scroll position state variable whenever the user scrolls
    setScrollPosition(event.target.scrollLeft)
  }

  if (typeof distance === 'undefined'){
    // show loading skeleton of 3 items while calculating initial cards position
    return (
      <div ref={divRef} className="container mx-auto sm:h-[22rem] flex gap-4 p-4">
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={'100%'}
          sx={{
            borderRadius:'0.5rem'
          }}
        />
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={'100%'}
          sx={{
            borderRadius:'0.5rem'
          }}
        />
      </div>
    )
  }

  return (
    <>
      {/* Reference Div to center align card */}
      <div ref={divRef} className="lg:container mx-auto invisible" />
      <div
        data-testid="highlights-carousel"
        className="group relative w-full overflow-x-visible sm:h-[22rem]"
      >
        {/* Left button */}
        {scrollPosition > 0 ?
          <LeftButton handlePrevClick={handlePrevClick} />
          : null
        }
        {/* Carousel */}
        <div
          ref={carousel}
          onScroll={handleScroll}
          // snap on mobile only
          className={'flex gap-4 snap-start sm:snap-none scroll-smooth overflow-x-scroll scrollbar-hide p-4'}
          style={{scrollbarWidth:'none',left:-scrollPosition, paddingLeft: distance +'px'}}>
          {/* render software card in the row direction */}
          {items.map(highlight => (
            <div
              key={highlight.id}
              className="snap-center shrink-0 hover:scale-[101%] transition duration-500">
              <HighlightsCard {...highlight}/>
            </div>
          ))}
        </div>
        {/* Right button */}
        <RightButton handleNextClick={handleNextClick} />
      </div>
    </>
  )
}
