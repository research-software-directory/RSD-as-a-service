import {useEffect,useState} from 'react'
import {ProjectOfOrganisation} from '../types/Organisation'
import {getProjectsForOrganisation} from './getOrganisations'

type UseOrganisationProjectProp = {
  searchFor?: string
  page: number,
  rows: number,
  organisation: string,
  token:string
}

type State = {
  count: number,
  data: ProjectOfOrganisation[]
}

export default function useOrganisationProjects({organisation, searchFor, page, rows,token}:
  UseOrganisationProjectProp) {
  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getProjects() {
      // set loding done
      setLoading(true)
      const projects: State = await getProjectsForOrganisation({
        organisation,
        searchFor,
        page,
        rows,
        token
      })
      // abort
      if (abort) return
      // set state
      setState(projects)
      // set loding done
      setLoading(false)
    }

    if (organisation) {
      getProjects()
    }

    return ()=>{abort = true}
  },[searchFor,page,rows,organisation,token,])

  return {
    projects:state.data,
    count:state.count,
    loading
  }
}
