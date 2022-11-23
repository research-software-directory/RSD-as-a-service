// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {daysDiff, isoStrToDate, olderThanXDays, getTimeAgoSince} from './dateFn'

describe('dateFn.daysDiff',()=>{
  it('calculates days in past diff > 2',()=>{
    const today = new Date('2020-11-12')
    const diff = daysDiff(today)
    expect(diff).toBeGreaterThan(2)
  })

  it('calculates days today=0',()=>{
    const today = new Date()
    const diff = daysDiff(today)
    expect(diff).toBe(0)
  })

  it('returns 0 if date in future',()=>{
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000 * 60 * 60)
    const diff = daysDiff(plus1)
    expect(diff).toBe(0)
  })

  it('returns null if no date provided',()=>{
    const diff = daysDiff('')
    expect(diff).toBe(undefined)
  })

})

describe('dateFn.isoStrToDate',()=>{
  it ('returns null on empty string',()=>{
    const date = isoStrToDate('')
    expect(date).toBeNull()
  })
  it ('converts to propper date',()=>{
    // const testStr="1970-11-23T00:00"
    const expected = new Date()
    const received = isoStrToDate(expected.toISOString())
    expect(expected).toEqual(received)
  })
})

describe('dateFn.olderThanXDays',()=>{
  it('returns false for today',()=>{
    const today = new Date()
    const value = olderThanXDays(today,7)
    expect(value).toEqual(false)
  })
  it('returns false for exactly 7 days',()=>{
    const atBoundary = new Date()
    atBoundary.setDate(atBoundary.getDate()-7)
    const value = olderThanXDays(atBoundary,7)
    expect(value).toEqual(false)
  })
  it('returns true for undefined',()=>{
    const value = olderThanXDays(undefined,7)
    expect(value).toEqual(true)
  })
  it('returns true for 2000-01-01 date',()=>{
    const oldDate = new Date('2000-01-01')
    const value = olderThanXDays(oldDate,7)
    expect(value).toEqual(true)
  })
  it('returns true for 9 days',()=>{
    const atBoundary = new Date()
    atBoundary.setDate(atBoundary.getDate()-9)
    const value = olderThanXDays(atBoundary,7)
    expect(value).toEqual(true)
  })
})

describe('dateFn.getTimeAgoSince', () => {
  it('returns 1 hour', () => {
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000*60*60)
    const diff = getTimeAgoSince(plus1, since.toISOString())
    expect(diff).toEqual('1 hour ago')
  })

  it('returns 3 hours ago', () => {
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000 * 60 * 60 *3)
    const diff = getTimeAgoSince(plus1, since.toISOString())
    expect(diff).toEqual('3 hours ago')
  })

  it('returns 1 day ago', () => {
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000 * 60 * 60 * 25)
    const diff = getTimeAgoSince(plus1, since.toISOString())
    expect(diff).toEqual('1 day ago')
  })

  it('returns 2 days ago', () => {
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000 * 60 * 60 * 48)
    const diff = getTimeAgoSince(plus1, since.toISOString())
    expect(diff).toEqual('2 days ago')
  })

  it('returns 1 week ago', () => {
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000 * 60 * 60 * 24 * 8)
    const diff = getTimeAgoSince(plus1, since.toISOString())
    expect(diff).toEqual('1 week ago')
  })

  it('returns 2 weeks ago', () => {
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000 * 60 * 60 * 24 * 14)
    const diff = getTimeAgoSince(plus1, since.toISOString())
    expect(diff).toEqual('2 weeks ago')
  })

  it('returns 1 month ago', () => {
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000 * 60 * 60 * 24 * 31)
    const diff = getTimeAgoSince(plus1, since.toISOString())
    expect(diff).toEqual('1 month ago')
  })

  it('returns 2 months ago', () => {
    const since = new Date()
    const plus1 = new Date(since.getTime() + 1000 * 60 * 60 * 24 * 60)
    const diff = getTimeAgoSince(plus1, since.toISOString())
    expect(diff).toEqual('2 months ago')
  })
})
