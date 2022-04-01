import {useEffect,useState} from 'react'
import {SoftwareOfOrganisation} from '../types/Organisation'
import {getSoftwareForOrganisation} from './getOrganisations'

type UseOrganisationSoftwareProp = {
  searchFor?: string
  page: number,
  rows: number,
  organisation: string,
  token:string
}

type State = {
  count: number,
  data: SoftwareOfOrganisation[]
}

export default function useOrganisationSoftware({organisation, searchFor, page, rows,token}:
  UseOrganisationSoftwareProp) {
  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getSoftware() {
      // set loding done
      setLoading(true)
      const software:State = await getSoftwareForOrganisation({
        organisation,
        searchFor,
        page,
        rows,
        token
      })
      // abort
      if (abort) return
      // set state
      setState(software)
      // set loding done
      setLoading(false)
    }

    if (organisation) {
      getSoftware()
    }

    return ()=>{abort = true}
  },[searchFor,page,rows,organisation,token])

  return {
    software:state.data,
    count:state.count,
    loading
  }
}
