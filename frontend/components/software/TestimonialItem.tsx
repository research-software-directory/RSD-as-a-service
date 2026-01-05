// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {styled} from '@mui/material/styles'
import {Testimonial} from '~/types/Testimonial'

const TestimonialContent = styled('div')(({theme}) => ({
  position:'relative',
  backgroundColor: `${theme.palette.primary.main}`,
  color: `${theme.palette.common.white}`,
  padding: '2.5rem',
  fontSize:'1.5rem',
  '&::after': {
    content: '""',
    width: 0,
    height: 0,
    border: '0 solid transparent',
    position: 'absolute',
    left: '4.5rem',
    top: '100%',
    borderTopWidth: 0,
    borderBottomWidth: '1.5rem',
    borderRight: `16px solid ${theme.palette.primary.main}`
  }
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GivenBy = styled('div')(({theme}) => ({
  margin: '20px 0 4em',
  paddingLeft:'6rem'
}))

export default function TestimonialItem({item}: {item: Testimonial}) {

  return (
    <div>
      <TestimonialContent>
        <blockquote className="before:content-['\201C'] after:content-['\201C']">
          {item.message}
        </blockquote>
        {/* &quot;  &quot; */}
      </TestimonialContent>
      <GivenBy>
        – {item.source}
      </GivenBy>
    </div>
  )
}
