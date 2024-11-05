// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type NewAnnouncement = {
  enabled: boolean
  text: string | null
}

export type AnnouncementItem = NewAnnouncement & {
  id: string
}

export const mockAnnouncement = {
  id: 'test-uuid-announcement',
  enabled: true,
  text: 'Test announcement text'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getAnnouncement(token?: string) {
  // console.log('getAnnouncement...default MOCK...')
  return mockAnnouncement
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveAnnouncement(item: AnnouncementItem, token: string) {
  // console.log('saveAnnouncement...default MOCK...')
  return jest.fn(()=>({
    status: 200,
    message: mockAnnouncement
  }))
}
