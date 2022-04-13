import {ParsedUrlQuery} from 'querystring'

export type PostgrestParams={
  baseUrl:string,
  search?:string,
  columns?:string[],
  filters?:string[],
  order?:string,
  limit:number,
  offset:number
}

export function softwareUrl(props:PostgrestParams){
  const {baseUrl,search,columns,filters,order,limit,offset} = props
  let url = `${baseUrl}/software?`

  if (columns){
    url+=`select=${columns.join(',')}`
  }

  // filters need to be after select to
  // add tag colum from tag table and
  // define join
  if(typeof filters !=='undefined'
    && filters?.length > 0){
    // add tag inner join
    url+=',tag_for_software!inner(tag)'
    // convert tags array to comma separated string
    const tagsIn = filters?.map((item:string)=>`"${encodeURIComponent(item)}"`).join(',')
    // add tag values to in statement
    url+=`&tag_for_software.tag=in.(${tagsIn})`
  }

  // always filter for only published software!
  url+='&is_published=eq.true'

  if (search){
    // search for term in brand_name and short_statement
    // we use ilike (case INsensitive) and * to indicate partial string match
    url+=`&or=(brand_name.ilike.*${search}*, short_statement.ilike.*${search}*))`
  }

  if (order){
    url+=`&order=${order}`
  }

  // add limit and offset
  url+=`&limit=${limit || 12}&offset=${offset || 0}`

  return url
}

type QueryParams={
  query: ParsedUrlQuery
  search?:any,
  filter?:any,
  page?:any,
  rows?:any
}

export function ssrSoftwareUrl(params:QueryParams){
  const view = 'software'
  const url = ssrUrl(params, view)
  return url
}

export function ssrOrganisationUrl(params: QueryParams) {
  const view = 'organisations'
  const url = ssrUrl(params,view)
  return url
}

export function ssrProjectsUrl(params: QueryParams) {
  const view = 'projects'
  const url = ssrUrl(params, view)
  return url
}

function ssrUrl(params: QueryParams, view:string) {
  const {search, filter, rows, page, query} = params
  let url = `/${view}?`
  if (search) {
    url += `search=${encodeURIComponent(search)}`
  } else if (search === '') {
    //remove search query
  } else if (query?.search) {
    url += `search=${encodeURIComponent(query.search.toString())}`
  }
  if (filter) {
    url += `&filter=${encodeURIComponent(filter)}`
  } else if (filter === null) {
    // remove filter
  } else if (query?.filter) {
    url += `&filter=${encodeURIComponent(query?.filter.toString())}`
  }
  if (page || page === 0) {
    url += `&page=${page}`
  } else if (query?.page) {
    url += `&page=${query.page}`
  } else {
    url += '&page=0'
  }
  if (rows) {
    url += `&rows=${rows}`
  } else if (query?.rows) {
    url += `&rows=${query?.rows}`
  } else {
    url += '&rows=12'
  }
  return url
}

/**
 * Provides url params for postgrest api pagination
 */
export function paginationUrlParams({rows=12, page=0}:
  {rows:number,page:number}) {
  let params = ''

  if (rows) {
    params += `&limit=${rows}`
  }
  if (page) {
    params += `&offset=${page * rows}`
  }
  return params
}
