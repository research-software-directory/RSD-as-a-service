// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Button from '@mui/material/Button'

import {getPageRange} from '~/utils/pagination'
import SearchInput from '~/components/search/SearchInput'
import SelectRows from '~/components/software/overview/search/SelectRows'
import ViewToggleGroup, {ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import FiltersModal from '~/components/filter/FiltersModal'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import useFilterQueryChange from '~/components/filter/useFilterQueryChange'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import CommunitySoftwareFilters from '../filters/index'

type SearchSoftwareSectionProps = {
  count: number
  keywordsList: KeywordFilterOption[],
  languagesList: LanguagesFilterOption[],
  licensesList: LicensesFilterOption[],
  categoryList: CategoryOption[],
  smallScreen: boolean
  layout: ProjectLayoutType
  setView: (view:ProjectLayoutType) => void
}

export default function SearchCommunitySoftwareSection({
  count, layout, keywordsList, smallScreen,
  languagesList, licensesList, categoryList, setView
}: SearchSoftwareSectionProps) {
  const {search,page,rows,filterCnt} = useSoftwareParams()
  const {handleQueryChange} = useFilterQueryChange()
  const [modal, setModal] = useState(false)

  const placeholder = filterCnt > 0 ? 'Find within selection' : 'Find software'

  // console.group('SearchCommunitySoftwareSection')
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('search...', search)
  // console.groupEnd()

  return (
    <section data-testid="search-section">
      <div className="flex border rounded-md shadow-xs bg-base-100 p-2">
        <SearchInput
          placeholder={placeholder}
          onSearch={(search: string) => handleQueryChange('search', search)}
          defaultValue={search ?? ''}
        />
        <ViewToggleGroup
          layout={layout}
          onSetView={setView}
          sx={{
            marginLeft:'0.5rem'
          }}
        />
        <SelectRows
          rows={rows}
          handleQueryChange={handleQueryChange}
        />
      </div>
      <div className="flex justify-between items-center px-1 py-2">
        <div className="text-sm opacity-70">
          {getPageRange(rows, page, count)}
        </div>
        {smallScreen === true &&
          <Button
            onClick={() => setModal(true)}
            variant="outlined"
          >
            Filters
          </Button>
        }
      </div>
      {smallScreen ?
        <FiltersModal
          open={modal}
          setModal={setModal}
        >
          <CommunitySoftwareFilters
            keywordsList={keywordsList}
            languagesList={languagesList}
            licensesList={licensesList}
            categoryList={categoryList}
          />
        </FiltersModal>
        : undefined
      }
    </section>
  )
}
