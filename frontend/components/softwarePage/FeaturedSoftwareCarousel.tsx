// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {UIEventHandler, useRef, useState} from 'react'
import {SoftwareCard} from './SoftwareCard'

export const FeaturedSoftwareCarousel = ({cards}: {cards:any}) => {

  const canrdMovement: number = 680 // card size + margin
  // const canrdMovementVertical: number = 320 // card size + margin

  // Keep track of the current scroll position of the carousel.
  const [scrollPosition, setScrollPosition] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  // Event handlers for the next and previous buttons.
  const handleNextClick = () => {
    // move the scroll to the left
    if (carousel.current) {
      carousel.current.scrollLeft -= canrdMovement
    }
  }

  const handlePrevClick = () => {
    if (carousel.current) {
      carousel.current.scrollLeft += canrdMovement
    }
  }

// TODO
  const handleScroll:UIEventHandler<HTMLDivElement> = (event:any) => {
    // update the scroll position state variable whenever the user scrolls
    setScrollPosition(event.target.scrollLeft)
  }

  return (
    <div className='group relative w-full overflow-x-visible' >
      {/* Left Button */}
      {scrollPosition > 0 &&
        <button onClick={handleNextClick}
              className='transition duration-500 opacity-0 scale-50 group-hover:scale-100 group-hover:opacity-40 hover:cursor-pointer hover:opacity-100 absolute left-8 top-1/2 z-10'>
        <div
          className='text-white bg-black w-16 h-16 -mt-8 rounded-full flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
              viewBox="0 0 256 256">
              <path fill="currentColor"
                d="M168.49 199.51a12 12 0 0 1-17 17l-80-80a12 12 0 0 1 0-17l80-80a12 12 0 0 1 17 17L97 128Z"></path>
            </svg>
          </div>
        </button>
      }

      {/* Right Button */}
      <button onClick={handlePrevClick}
          className='transition duration-500 opacity-0 scale-50 group-hover:scale-100 group-hover:opacity-50 hover:cursor-pointer hover:opacity-100 absolute right-8 top-1/2 z-10'>
          <div className='text-white bg-black w-16 h-16 -mt-8 rounded-full flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
              viewBox="0 0 256 256">
              <path fill="currentColor"
                d="m184.49 136.49l-80 80a12 12 0 0 1-17-17L159 128L87.51 56.49a12 12 0 1 1 17-17l80 80a12 12 0 0 1-.02 17Z"></path>
            </svg>
          </div>
        </button>


      {/* Carousel */}
      <div
        ref={carousel}
        onScroll={handleScroll}
        // snap on mobile only
        className="flex gap-4 snap-start sm:snap-none scroll-smooth overflow-x-scroll scrollbar-hide p-4 sm:pr-[600px] lg:pl-[100px] 2xl:pl-[400px] "
        style={{left: -scrollPosition}}>
        {/* TODO  software card type */}
        {cards.length > 0 && cards.map((card: any, index: number) => (
          <div key={index}
          className="snap-center flex-shrink-0 hover:scale-[101%] transition duration-500">
            <SoftwareCard index={index} item={card} direction={'row'}/>
          </div>
        ))
      }
      </div>
    </div>
  )
}
