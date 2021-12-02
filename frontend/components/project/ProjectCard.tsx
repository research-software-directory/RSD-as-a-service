import router from 'next/router'

import styled from '@mui/system/styled'

// import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea} from '@mui/material';

import {ProjectItem} from '../../types/ProjectItem'


const Card = styled('section')(({theme})=>({
  display:'flex',
  flexDirection:'column',
  justifyContent:'flex-start',
  alignItems:'flex-start',
  minHeight:'21rem',
  border: `1px solid ${theme.palette.divider}`,
  padding:'1.5rem 1rem',
  overflow: 'hidden',
  ':hover':{
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer'
  }
}))

const CardHeader = styled('div')(({theme})=>({
  width:'100%',
  padding:'0rem 0rem 1rem 0rem'
}))


const CardBadges = styled('div')({
  width:'100%',
  display:'flex',
  justifyContent:'flex-start',
  padding: '1rem 0rem'
})

const CardSummary = styled('div')(({theme})=>({
  display:'flex',
  width: '100%',
  justifyContent:'space-between'
}))

const CardContent = styled('div')({
  display:'block',
  padding: '1rem 0rem'
})

export default function ProjectCard({project}:{project:ProjectItem}) {
  function goProjectPage(){
    router.push(`/projects/${project.primaryKey.id}`)
  }
  return (
    <Card
      role="button"
      tabIndex={0}
      onKeyDown={(key)=>key.code==='Enter' ? goProjectPage() : null}
      onClick={goProjectPage}
    >
      <CardHeader>
        <Typography gutterBottom variant="h2"
          color="default"
          title={project.title}
          sx={{
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {project.subtitle}
        </Typography>
      </CardHeader>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui, animi?
        </Typography>
      </CardContent>
    </Card>
  )
}