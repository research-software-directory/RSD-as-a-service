// SPDX-FileCopyrightText: 2021 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import router from 'next/router'

export function nextRouterWithLink(e:any, path:string){
  // prevent default link behaviour (reloading page)
  if (path){
    if (e?.preventDefault) e.preventDefault()
    // and use next router instead
    router.push(path)
  }
}
