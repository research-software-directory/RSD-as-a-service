import router from 'next/router'

export function nextRouterWithLink(e:any, path:string){
  // preven default link behaviour (reloading page)
  e.preventDefault()
  // and use next router instead
  router.push(path)
}