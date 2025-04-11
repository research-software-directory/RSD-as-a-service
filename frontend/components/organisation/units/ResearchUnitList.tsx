// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

/**
 * UnitsList component is adjusted OrganisationsList component
 * from (/components/software/organisations/)
 */
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import List from '@mui/material/List'

import ContentLoader from '~/components/layout/ContentLoader'
import ResearchUnitItem from './ResearchUnitItem'

import {OrganisationUnitsForOverview} from '~/types/Organisation'

type UnitsListProps = {
  loading: boolean
  units: OrganisationUnitsForOverview[]
  isPrimaryMaintainer: boolean
  onEdit: (pos: number) => void
}

export default function ResearchUnitsList({loading, units, onEdit, isPrimaryMaintainer}: UnitsListProps) {

  if (loading) {
    return <ContentLoader />
  }

  if (units.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight: 500}}>The organisation has no research units</AlertTitle>
        {
          isPrimaryMaintainer ?
            <span>Add one using <strong>ADD button!</strong></span>
            :null
        }
      </Alert>
    )
  }

  return (
    <List sx={{
      width: '100%',
    }}>
      { units.map((item,pos) => {
        return (
          <ResearchUnitItem
            key={pos}
            pos={pos}
            slug={item.slug}
            name={item.name}
            website={item.website}
            logo_id={item.logo_id}
            isMaintainer={isPrimaryMaintainer}
            onEdit={onEdit}
          />
        )
      })
      }
    </List>
  )
}
