
import {softwareUrl, ssrSoftwareUrl} from './postgrestUrl'

describe('softwareUrl', () => {
  it('returns softwareUrl when only baseUrl provided', () => {
    const baseUrl='http://test-base-url'
    const expectUrl = `${baseUrl}/software?&is_published=eq.true&limit=12&offset=0`
    const url = softwareUrl({
      baseUrl
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns softwareUrl with filters', () => {
    const baseUrl = 'http://test-base-url'
    // if you change filters in the array then change expectedUrl values too
    const expectUrl = `${baseUrl}/software?,tag_for_software!inner(tag)&tag_for_software.tag=in.(\"filter-1\",\"filter-2\")&is_published=eq.true&limit=12&offset=0`
    const url = softwareUrl({
      baseUrl,
      // if you change filters in the array then change expectedUrl values too
      filters:['filter-1','filter-2']
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns softwareUrl with search', () => {
    const baseUrl = 'http://test-base-url'
    // if you change search value then change expectedUrl values too
    const expectUrl = `${baseUrl}/software?&is_published=eq.true&or=(brand_name.ilike.*test-search*, short_statement.ilike.*test-search*))&limit=12&offset=0`
    const url = softwareUrl({
      baseUrl,
      // if you change search value then change expectedUrl values too
      search:'test-search'
    })
    expect(url).toEqual(expectUrl)
  })
})


describe('ssrSoftwareUrl', () => {
  it('returns ssrSoftwareUrl with query filter', () => {
    const expectUrl = '/software?&filter=filter-1%2Cfilter-2&page=0&rows=12'
    const url = ssrSoftwareUrl({
      query:{filter:['filter-1','filter-2']}
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns ssrSoftwareUrl with search param and page 10', () => {
    const expectUrl = '/software?search=test-search-item&page=10&rows=12'
    const url = ssrSoftwareUrl({
      query: {},
      search: 'test-search-item',
      page: 10
    })
    expect(url).toEqual(expectUrl)
  })

  it('ignores query when filter prop provided, page 10 and 50 rows', () => {
    const expectUrl = '/software?search=test-search-item&filter=stringified-filter-prefered&page=10&rows=50'
    const url = ssrSoftwareUrl({
      filter: 'stringified-filter-prefered',
      query:{filter:['filter-1','filter-2']},
      search: 'test-search-item',
      page: 10,
      rows: 50
    })
    expect(url).toEqual(expectUrl)
  })
})
