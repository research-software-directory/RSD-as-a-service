// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'

import {LayoutOptions} from '~/components/cards/CardsLayoutOptions'
import OverviewSearchSection from '~/components/projects/overview/search/OverviewSearchSection'
import useQueryChange from '../useQueryChange'
import OrgProjectFiltersModal from '../filters/OrgProjectFiltersModal'
import useProjectParams from '../useProjectParams'

type SearchSectionProps = {
  // search?: string | null
  // page: number
  // rows: number
  count: number
  // placeholder: string
  layout: LayoutOptions
  // setModal: (modal: boolean) => void
  setView: (view:LayoutOptions)=>void
}


export default function OrgSearchProjectSection({
  count, layout, setView
}: SearchSectionProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  const {search,page,rows,filterCnt} = useProjectParams()
  const {handleQueryChange} = useQueryChange()
  const [modal, setModal] = useState(false)

  const placeholder = filterCnt > 0 ? 'Find within selection' : 'Find project'

  // console.group('OrgSearchProjectSection')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('search...', search)
  // console.groupEnd()

  return (
    <>
      <OverviewSearchSection
        page={page}
        rows={rows}
        count={count}
        search={search}
        placeholder={placeholder}
        layout={layout}
        setView={setView}
        setModal={setModal}
        handleQueryChange={handleQueryChange}
      />
      {
        smallScreen === true &&
         <OrgProjectFiltersModal
           open={modal}
           setModal={setModal}
         />
      }
    </>
  )
}
