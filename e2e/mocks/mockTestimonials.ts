// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export type Testimonial = {
  message: string,
  source: string
}

export const mockTestimonial = {
  chrome: [
    {
      message: 'This is my testimonal for chrome 1',
      source: 'Me, Here, Today'
    },
    {
      message: 'This is my testimonal for chrome 2',
      source: 'You, There, Yesterday'
    },
  ],
  chromium: [
    {
      message: 'This is my testimonal for chromium 1',
      source: 'Me, Here, Today'
    },
    {
      message: 'This is my testimonal for chromium 2',
      source: 'You, There, Yesterday'
    },
  ],
  firefox: [
    {
      message: 'This is my testimonal for firefox 1',
      source: 'Me, Here, Today'
    },
    {
      message: 'This is my testimonal for firefox 2',
      source: 'You, There, Yesterday'
    },
  ],
  msedge: [
    {
      message: 'This is my testimonal for msedge 1',
      source: 'Me, Here, Today'
    },
    {
      message: 'This is my testimonal for msedge 2',
      source: 'You, There, Yesterday'
    },
  ],
  webkit: [
    {
      message: 'This is my testimonal for webkit 1',
      source: 'Me, Here, Today'
    },
    {
      message: 'This is my testimonal for webkit 2',
      source: 'You, There, Yesterday'
    },
  ]
}
