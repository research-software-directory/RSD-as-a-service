// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import styled from '@mui/system/styled'
import BlockIcon from '@mui/icons-material/Block'

import ProjectCard from '~/components/projects/ProjectCard'
import IconBtnMenuOnAction from '~/components/menu/IconBtnMenuOnAction'
import IconOverlay from '~/components/layout/IconOverlay'
import {ProjectCardWithMenuProps, useProjectCardActions} from './useProjectCardActions'


const StyledNav = styled('nav')(({theme})=>({
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  zIndex: 9,
  opacity: 0.5,
  '&:hover': {
    opacity: 1
  }
}))


export default function ProjectCardWithMenu({organisation,item,token}: ProjectCardWithMenuProps) {
  const {project,menuOptions,onAction} = useProjectCardActions({organisation,item,token})

  function renderStatus() {
    if (project.status === 'approved') return null
    return (
      <IconOverlay
        title={`Affiliation denied for ${project.title}`}
      >
        <a href={`/projects/${project.slug}/`} target="_blank" rel="noreferrer">
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
      <ProjectCard
        key={project.id}
        {...project}
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
