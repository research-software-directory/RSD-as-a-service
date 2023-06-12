// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import styled from '@mui/system/styled'
import BlockIcon from '@mui/icons-material/Block'

import SoftwareCard from '~/components/software/SoftwareCard'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import IconOverlay from '~/components/layout/IconOverlay'
import {SoftwareCardWithMenuProps, useSoftwareCardActions} from './useSoftwareCardActions'


const StyledNav = styled('nav')(({theme})=>({
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '4rem',
  height: '4rem',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.secondary.main,
  zIndex: 7
}))


export default function SoftwareCardWithMenu({organisation,item,token}: SoftwareCardWithMenuProps) {
  const {software,menuOptions,onAction} = useSoftwareCardActions({organisation,item,token})

  function renderStatus() {
    if (software.status === 'approved') return null
    return (
      <IconOverlay
        title={`Affiliation denied for ${software.brand_name}`}
      >
        <a href={`/software/${software.slug}/`} target="_blank" rel="noreferrer">
        <BlockIcon
          sx={{
            width: '100%',
            height: '100%',
            color: 'error.main'
          }}
          />
        </a>
      </IconOverlay>
    )
  }

  return (
    <div className="relative h-full">
      <SoftwareCard
        key={software.id}
        href={`/software/${software.slug}/`}
        brand_name={software.brand_name}
        short_statement={software.short_statement}
        is_featured={software.is_featured}
        updated_at={software.updated_at}
        mention_cnt={software.mention_cnt}
        contributor_cnt={software.contributor_cnt}
        is_published={software.is_published}
      />
      <StyledNav>
        <IconBtnMenuOnAction
          options={menuOptions}
          onAction={onAction}
        />
      </StyledNav>
      {renderStatus()}
    </div>
  )
}
