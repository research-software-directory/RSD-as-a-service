// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
//
// SPDX-License-Identifier: EUPL-1.2

/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import {OrganisationForOverview} from '~/types/Organisation'

/*! purgecss start ignore */
import 'aos/dist/aos.css'
import {getUrlFromLogoId} from '~/utils/editOrganisation'
import {IconButton} from '@mui/material'
import {ChevronLeft, ChevronRight} from '@mui/icons-material'
/*! purgecss end ignore */

export default function ParticipatingOrganisations(
    {organisations, sbRef}: {organisations: OrganisationForOverview[], sbRef: any},
  ) {
    const commonButtonStyle = {
      fontSize: '2.5rem',
      color: 'text.primary',
      backgroundColor: 'white',
      position: 'absolute',
      transform: 'translateY(-50%)',
      top: '50%',
      '&:hover': {
        color: 'white',
        backgroundColor: 'text.primary',
      },
    }

    const buttonStyleLeft = {
      ...commonButtonStyle,
      left: '0px',
    }

    const buttonStyleRight = {
      ...commonButtonStyle,
      right: '0px',
    }

    const wrapperSelector = '#hgf-simplebar .simplebar-content-wrapper'

    const moveRight = () => {
      const container = document.querySelector(wrapperSelector)
      if (container) {
        container.scroll({
          left: container.scrollLeft + 500,
          top: 0,
          behavior: 'smooth',
        })
      }
    }

    const moveLeft = () => {
      const container = document.querySelector(wrapperSelector)
      if (container) {
        container.scroll({
          left: container.scrollLeft - 500,
          top: 0,
          behavior: 'smooth',
        })
      }
    }

    return (
      <div className="w-full h-full relative">
        <SimpleBar
          id="hgf-simplebar"
          ref={sbRef}
          autoHide={false}
          forceVisible="x"
          style={{maxHeight: 300}}
        >
          <div id="hgf-scroll-container">
            {
              organisations.map(item => {
                return(
                  <Link
                    key={`link_${item.name}`}
                    href={`/organisations/${item.rsd_path}`}
                    passHref
                  >
                    <img
                      alt={item.name}
                      src={getUrlFromLogoId(item.logo_id) ?? undefined}
                      className="p-10 hover:cursor-pointer"
                    />
                  </Link>
                )
              })
            }
          </div>
        </SimpleBar>

        <IconButton
          id="scrollLeftButton"
          sx={buttonStyleLeft}
          onClick={moveLeft}
        >
          <ChevronLeft fontSize="inherit" />
        </IconButton>

        <IconButton
          id="scrollRightButton"
          sx={buttonStyleRight}
          onClick={moveRight}
        >
          <ChevronRight fontSize="inherit" />
        </IconButton>
      </div>
    )
  }
