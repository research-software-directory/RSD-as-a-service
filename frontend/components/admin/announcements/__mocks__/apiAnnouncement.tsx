// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
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
export const getAnnouncement=jest.fn((token?: string)=>{
  // console.log('getAnnouncement...default MOCK...')
  return Promise.resolve(mockAnnouncement)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const saveAnnouncement=jest.fn(async(item: AnnouncementItem, token: string)=>{
  // console.log('saveAnnouncement...default MOCK...')
  return jest.fn(()=>({
    status: 200,
    message: mockAnnouncement
  }))
})
