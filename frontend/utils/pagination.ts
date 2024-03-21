// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export function getPageRange(rows: number, page: number, total: number): string {
  if (page <= 0) {
    page = 1
  }

  return `${(page - 1) * rows + 1}-${Math.min(total, page * rows)} of ${total}`
}
