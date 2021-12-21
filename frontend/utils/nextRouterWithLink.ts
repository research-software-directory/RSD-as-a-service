import router from 'next/router'

export function nextRouterWithLink(e:any, path:string){
  // prevent default link behaviour (reloading page)
  if (path){
    if (e?.preventDefault) e.preventDefault()
    // and use next router instead
    router.push(path)
  }
}
