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
import {useState} from 'react'

type StyledNavProps = {
  is_featured: boolean
  in_focus: boolean
}

const StyledNav = styled('nav', {
  shouldForwardProp(propName) {
    // all custom props that should not be passed to html elements
    // should be added here using &&
    return propName!=='is_featured' && propName!=='in_focus'
  },
})<StyledNavProps>(({theme, is_featured, in_focus}) => {
  let color, hovercolor
  if (is_featured) {
    color = theme.palette.primary.contrastText
    hovercolor = theme.palette.primary.contrastText
  } else if (in_focus) {
    color = theme.palette.primary.contrastText
    hovercolor = theme.palette.secondary.main
  } else {
    color = theme.palette.secondary.main
    hovercolor = theme.palette.secondary.main
  }
  // console.group('StyledNav')
  // console.log('is_featured...', is_featured)
  // console.log('in_focus...', in_focus)
  // console.log('color...', color)
  // console.log('hovercolor...', hovercolor)
  // console.groupEnd()
  return {
    position: 'absolute',
    right: '0.5rem',
    top: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    color,
    zIndex: 7,
    '&:hover': {
      color: hovercolor
    }
  }
})


export default function ProjectCardWithMenu({organisation,item}: ProjectCardWithMenuProps) {
  const {project, menuOptions, onAction} = useProjectCardActions({organisation, item})
  const [hover,setHover]=useState(false)

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
    <div className="relative h-full"
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
    >
      <ProjectCard
        key={project.id}
        menuSpace={true}
        {...project}
      />
      <StyledNav
        is_featured={project.is_featured ?? false}
        in_focus={hover}
      >
        <IconBtnMenuOnAction
          options={menuOptions}
          onAction={onAction}
        />
      </StyledNav>
      {renderStatus()}
    </div>
  )
}
