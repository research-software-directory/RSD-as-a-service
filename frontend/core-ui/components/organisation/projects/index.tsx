// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import FlexibleGridSection, {useAdvicedDimensions} from '~/components/layout/FlexibleGridSection'
import {OrganisationComponentsProps} from '../OrganisationNavItems'
import SearchAndPagination from '../SearchAndPagination'
import UserAgrementModal from '~/components/user/settings/UserAgreementModal'
import OrganisationProjectCards from './OrganisationProjectsCards'
import Pagination from '@mui/material/Pagination'

export default function OrganisationProjects({organisation, isMaintainer}:OrganisationComponentsProps) {
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions()
  const {searchFor,page,rows,count,setCount,setPage} = usePaginationWithSearch(`Find project in ${organisation.name}`)
  const pageCount = Math.ceil(count/rows)

  return (
    <>
      <SearchAndPagination title="Projects" />
      {/* Only when maintainer */}
      {isMaintainer && <UserAgrementModal />}
      {/* Project grid */}
      <FlexibleGridSection
        height={itemHeight}
        minWidth={minWidth}
        maxWidth={maxWidth}
        className="gap-[0.125rem] p-[0.125rem] pt-2 pb-12"
      >
        <OrganisationProjectCards
          organisation={organisation}
          setCount={setCount}
          searchFor={searchFor}
          page={page}
          rows={rows}
          isMaintainer={isMaintainer}
        />
      </FlexibleGridSection>
      <div className="flex flex-wrap justify-center">
        {pageCount > 1 &&
          <Pagination
            size="large"
            shape="rounded"
            count={pageCount}
            page={page + 1}
            onChange={(e:any,page:number)=>setPage(page-1)}
          />
        }
      </div>
    </>
  )
}
