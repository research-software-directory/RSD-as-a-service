// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type NewAnnouncement = {
  enabled: boolean
  text: string | null
}

export type AnnouncementItem = NewAnnouncement & {
  id: string
}

export const mockAnnoucement = {
  id: 'test-uuid-announcement',
  enabled: true,
  text: 'Test annoucement text'
}

export async function getAnnouncement(token?: string) {
  // console.log('getAnnouncement...default MOCK...')
  return mockAnnoucement
}


export async function saveAnnouncement(item: AnnouncementItem, token: string) {
  // console.log('saveAnnouncement...default MOCK...')
  return jest.fn(()=>({
    status: 200,
    message: mockAnnoucement
  }))
}
