
import styled from '@mui/system/styled'
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge'
import RecommendIcon from '@mui/icons-material/Recommend';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import {
  getSoftwareMentionsCnt,
  getSoftwareProjectCnt,
  getSoftwareOrganizationCnt} from '../../utils/getCounts'
import {SoftwareItem} from '../../types/SoftwareItem'
import { nextRouterWithLink } from '../layout/nextRouterWithLink';
import LastUpdate from './LastUpdate'

const Card = styled('a')(({theme})=>({
  display:'flex',
  flexDirection:'column',
  justifyContent:'flex-start',
  alignItems:'flex-start',
  minHeight:'21rem',
  border:`1px solid ${theme.palette.divider}`,
  padding:'1.5rem 1rem',
  textDecoration:'none',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  overflow: 'hidden',
  ':hover':{
    backgroundColor: theme.palette.secondary.main,
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

export default function SoftwareCard({software}:{software:SoftwareItem}) {
  function goSoftwarePage(e:any){
    // router.push(`/software/${software.slug}`)
    nextRouterWithLink(e,`/software/${software.slug}`)
  }
  return (
    <Card
      role="button"
      tabIndex={0}
      onKeyDown={(key)=>key.code==='Enter' ? goSoftwarePage(undefined) : null}
      onClick={goSoftwarePage}
      href={`/software/${software.slug}`}
    >
      <CardHeader>
        <Typography gutterBottom variant="h2"
          title={software.brandName}
          sx={{
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {software.brandName}
        </Typography>
        <Typography variant="body2">
          {software.programmingLanguage.join(', ')}
        </Typography>
      </CardHeader>
      <CardSummary>
        <CardBadges>
          <Badge
            title="Mentions"
            showZero={true}
            badgeContent={getSoftwareMentionsCnt(software)}
            sx={{
              margin:'0rem 1rem 0rem 0rem',
            }}
          >
            <RecommendIcon />
          </Badge>
          <Badge
            title="Projects"
            showZero={true}
            badgeContent={getSoftwareProjectCnt(software)}
            sx={{
              margin:'0rem 1rem 0rem 0rem'
            }}
          >
            <DescriptionIcon />
          </Badge>
          <Badge
            title="Organizations"
            showZero={true}
            badgeContent={getSoftwareOrganizationCnt(software)}
          >
            <AccountBalanceIcon />
          </Badge>
        </CardBadges>
        {
          software.updatedAt ?
          <LastUpdate updatedAt={software.updatedAt} />
          : null
        }
      </CardSummary>
      <CardContent>
        <Typography variant="body2">
          {software.shortStatement}
        </Typography>
      </CardContent>
    </Card>
  )
}