
export type PostgrestParams={
  baseUrl:string,
  search?:string,
  columns?:string[],
  filters?:string,
  order?:string,
  limit:number,
  offset:number
}

export function softwareUrl(props:PostgrestParams){
  const {baseUrl,search,columns,filters,order,limit,offset} = props
  let url = `${baseUrl}/software?`

  debugger

  if (columns){
    url+=`select=${columns.join(",")}`
  }

  if (search){
    url+=`&or=(brand_name.ilike.*${search}*, short_statement.ilike.*${search}*))`
  }

  if(filters){
    url+=`&${filters}`
  }

  if (order){
    url+=`&order=${order}`
  }

  // add limit and offset
  url+=`&limit=${limit}&offset=${offset}`

  return url
}
