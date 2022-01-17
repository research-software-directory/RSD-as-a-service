import {daysDiff, isoStrToDate, olderThanXDays} from './dateFn'

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
    const date = new Date('2022-11-25')
    const diff = daysDiff(date)
    expect(diff).toBe(0)
  })

  it('returns null if no date provided',()=>{
    const diff = daysDiff()
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
