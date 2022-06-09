import {useEffect} from 'react'
import {Session} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import GridScrim from '~/components/layout/GridScrim'
import OrganisationGrid from '~/components/organisation/OrganisationGrid'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useUserOrganisations from './useUserOrganisations'

export default function UserOrganisations({session}: { session: Session }) {
  const {
    searchFor,
    page,
    rows,
    setCount
  } = usePaginationWithSearch('Search for organisation')
  const {loading, organisations, count} = useUserOrganisations({
    searchFor,
    page,
    rows,
    session
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  // do not use loader for now
  // because the layout jumps up-and-down
  // on pagination
  // if (loading) {
  //   return (
  //     <ContentLoader />
  //   )
  //   // return (
  //   //   <GridScrim
  //   //     rows={rows}
  //   //     height='17rem'
  //   //     minWidth='25rem'
  //   //     maxWidth='1fr'
  //   //     className="gap-[0.125rem] pt-2 pb-12"
  //   //   />
  //   // )
  // }

  return (
    <OrganisationGrid
      organisations={organisations}
    />
  )
}
