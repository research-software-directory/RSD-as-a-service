// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import SoftwareCard from '~/components/software/SoftwareCard'
import {OrganisationForOverview} from '~/types/Organisation'
import useOrganisationSoftware from '~/utils/useOrganisationSoftware'
import SoftwareCardWithMenu from './SoftwareCardWithMenu'

type OrganisationSoftwareGridProps = {
  organisation: OrganisationForOverview
  searchFor?:string
  page:number
  rows:number
  isMaintainer: boolean
  setCount:(count:number)=>void
}

export default function OrganisationSoftwareCards(props: OrganisationSoftwareGridProps) {
  const {token} = useSession()
  const {organisation,searchFor,page,rows,isMaintainer,setCount} = props
  const {loading, software, count} = useOrganisationSoftware({
    organisation: organisation.id,
    searchFor,
    page,
    rows,
    isMaintainer,
    token
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  // show loader
  if (loading===true) return <ContentLoader />

  if (software.length === 0
      && loading === false) {
    // show nothing to show message
    // if no items and loading is completed
    return <NoContent />
  }
  // render content
  return (
    <>
      {software.map(item => {
        if (isMaintainer) {
          return(
            <SoftwareCardWithMenu
              key={item.id}
              organisation={organisation}
              item={item}
              token={token}
            />
          )
        }
        return(
          <SoftwareCard
            key={`/software/${item.slug}/`}
            href={`/software/${item.slug}/`}
            {...item}
          />
        )
      })}
    </>
  )
}
