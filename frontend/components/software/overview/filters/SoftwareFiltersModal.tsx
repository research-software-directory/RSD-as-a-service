// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {HostsFilterOption} from '~/components/filter/RsdHostFilter'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import SoftwareFilters from './index'

type SoftwareFiltersModalProps = {
  open: boolean
  keywords?: string[]
  keywordsList: KeywordFilterOption[]
  prog_lang?: string[]
  languagesList: LanguagesFilterOption[]
  licenses?: string[]
  licensesList: LicensesFilterOption[]
  categories: string[]
  categoryList: CategoryOption[]
  rsd_host?: string
  hostsList?: HostsFilterOption[]
  hasRemotes?: boolean
  order: string
  filterCnt: number
  setModal:(open:boolean)=>void
}

export default function SoftwareFiltersModal({
  open, keywords, keywordsList,
  prog_lang, languagesList,
  licenses, licensesList,
  categories, categoryList,
  rsd_host, hostsList,
  hasRemotes, filterCnt, order,
  setModal
}:SoftwareFiltersModalProps) {
  const smallScreen = useMediaQuery('(max-width:640px)')
  return (
    <Dialog
      fullScreen={smallScreen}
      open={open}
      aria-labelledby="filters-panel"
      aria-describedby="filters-panel-responsive"
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        Filters
      </DialogTitle>
      <DialogContent>
        <div className="flex py-8 flex-col gap-8">
          <SoftwareFilters
            keywords={keywords ?? []}
            keywordsList={keywordsList}
            languages={prog_lang ?? []}
            languagesList={languagesList}
            licenses={licenses ?? []}
            licensesList={licensesList}
            categories={categories ?? []}
            categoryList={categoryList ?? []}
            rsd_host={rsd_host}
            hostsList={hostsList}
            orderBy={order ?? ''}
            filterCnt={filterCnt}
            hasRemotes={hasRemotes}
          />
        </div>
      </DialogContent>
      <DialogActions sx={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          onClick={()=>setModal(false)}
          color="secondary"
          sx={{marginRight:'2rem'}}
        >
          Cancel
        </Button>
        <Button
          onClick={()=>setModal(false)}
          color="primary"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  )
}
