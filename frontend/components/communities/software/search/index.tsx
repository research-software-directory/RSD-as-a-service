// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import Button from '@mui/material/Button'

import useSmallScreen from '~/config/useSmallScreen'
import {useUserSettings} from '~/config/UserSettingsContext'
import {getPageRange} from '~/utils/pagination'
import useHandleQueryChange from '~/utils/useHandleQueryChange'
import SearchInput from '~/components/search/SearchInput'
import FiltersModal from '~/components/filter/FiltersModal'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import useSoftwareParams from '~/components/organisation/software/filters/useSoftwareParams'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'
import CommunitySoftwareFilters from '~/components/communities/software/filters/index'

type SearchSoftwareSectionProps = {
  count: number
  keywordsList: KeywordFilterOption[],
  languagesList: LanguagesFilterOption[],
  licensesList: LicensesFilterOption[],
  categoryList: CategoryOption[]
}

export default function SearchCommunitySoftwareSection({
  count, keywordsList, languagesList,
  licensesList, categoryList,
}: SearchSoftwareSectionProps) {

  const smallScreen = useSmallScreen()
  const {search,page,rows,filterCnt,view} = useSoftwareParams()
  const {setPageLayout,setPageRows} = useUserSettings()
  const {handleQueryChange} = useHandleQueryChange()
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
        <ToggleViewGroup
          view={view}
          onChangeView={setPageLayout}
          sx={{
            marginLeft:'0.5rem'
          }}
        />
        <ShowItemsSelect
          items={rows}
          onItemsChange={(items)=>{
            setPageRows(items)
            handleQueryChange('rows', items.toString())
          }}
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
