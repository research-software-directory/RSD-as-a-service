// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
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
import {ResearchDomainOption} from '~/components/filter/ResearchDomainFilter'
import {OrganisationOption} from '~/components/filter/OrganisationsFilter'

import ProjectFilters from './index'
import {StatusFilterOption} from './ProjectStatusFilter'

type ProjectFiltersModalProps = {
  open: boolean,
  orderBy: string
  keywords: string[]
  keywordsList: KeywordFilterOption[]
  domains: string[],
  domainsList: ResearchDomainOption[]
  organisations: string[]
  organisationsList: OrganisationOption[]
  status: string
  statusList: StatusFilterOption[]
  filterCnt: number,
  setModal:(open:boolean)=>void
}

export default function ProjectFiltersModal({
  open, keywords, keywordsList,
  domains, domainsList,
  organisations, organisationsList,
  status, statusList,
  filterCnt, orderBy,
  setModal
}:ProjectFiltersModalProps) {
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
          <ProjectFilters
            filterCnt={filterCnt}
            orderBy={orderBy ?? ''}
            keywords={keywords ?? []}
            keywordsList={keywordsList}
            domains={domains ?? []}
            domainsList={domainsList}
            organisations={organisations ?? []}
            organisationsList={organisationsList}
            status={status}
            statusList={statusList}
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
