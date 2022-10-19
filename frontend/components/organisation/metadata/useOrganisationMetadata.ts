import {useEffect, useState} from 'react'
import {getOrganisationMetadata, RORItem} from '~/utils/getROR'

export function useOrganisationmMetadata(ror_id: string|null) {
  const [meta, setMeta] = useState <RORItem|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getMeta() {
      const resp = await getOrganisationMetadata(ror_id)
      setMeta(resp)
      setLoading(false)
    }
    if (ror_id) {
      getMeta()
    }
  },[ror_id])

  return {
    meta,
    loading
  }
}
