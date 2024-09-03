// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// Based on record from testimonial table
// 003-create-relations-for-software.sql

export type NewTestimonial = {
  id: string | null
  position?: number
  message: string|null,
  source: string|null,
}

export type Testimonial = NewTestimonial & {
  id: string
  position: number
}

