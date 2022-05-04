import {useEffect, useState} from 'react'

import {Provider} from 'pages/api/fe/auth'

export default function useLoginProviders() {
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    const abort = false

    async function getProviders() {
      const url = '/api/fe/auth'
      const resp = await fetch(url)
      if (resp.status === 200 && abort === false) {
        const providers:Provider[] = await resp.json()
        setProviders(providers)
      }
    }
    if (abort === false) {
      getProviders()
    }
  }, [])

  return providers
}
