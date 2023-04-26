// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import SoftwareFilters from './index'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import {KeywordFilterOption, LanguagesFilterOption, LicensesFilterOption} from './softwareFiltersApi'

type FilterModalProps = {
  open: boolean,
  keywords?: string[]
  keywordsList: KeywordFilterOption[],
  prog_lang?: string[],
  languagesList: LanguagesFilterOption[],
  licenses?: string[],
  licensesList: LicensesFilterOption[],
  order: string,
  filterCnt: number,
  resetFilters: () => void
  handleQueryChange: (key: string, value: string | string[]) => void
  setModal:(open:boolean)=>void
}

export default function FilterModal({
  open, keywords, keywordsList,
  prog_lang, languagesList,
  licenses, licensesList,
  filterCnt, order,
  resetFilters, setModal,
  handleQueryChange
}:FilterModalProps) {
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
            orderBy={order ?? ''}
            filterCnt={filterCnt}
            resetFilters={resetFilters}
            handleQueryChange={handleQueryChange}
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
