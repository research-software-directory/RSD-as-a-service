import Link from 'next/link'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Badge from '@mui/material/Badge'

import MentionIsFeatured from './MentionIsFeatured'
import {Mention} from '../../utils/getSoftware'
import {mentionType,MentionType} from '../../types/MentionType'
import {sortOnDateProp} from '../../utils/sortFn'
import {isoStrToLocalDateStr} from '../../utils/dateFn'

type MentionByType={
  [key:string]: Mention[]
}

export default function MentionsByType({mentions}: { mentions: Mention[] }) {
  const {mentionByType, featuredMentions} = clasifyMentions(mentions)
  const mentionTypes = Object.keys(mentionByType).sort()

  return (
    <section>
      {featuredMentions.map(item => {
        return (
          <MentionIsFeatured key={item.url} mention={item} />
        )
      })}
      {mentionTypes.map((key) => {
        const items = mentionByType[key]
        return renderMentionSectionForType(key as MentionType, items)
      })}
    </section>
  )
}

function clasifyMentions(mentions: Mention[]) {
  let mentionByType: MentionByType = {}
  let featuredMentions:Mention[]=[]

  mentions.forEach(item => {
    // remove array with software uuid
    delete item.mention_for_software
    // check if type prop exists
    let mType = item?.type as string ?? 'default'
    // extract featured mentions
    if (item.is_featured === true) {
      mType = 'featured'
      featuredMentions.push(item)
    } else if (mentionByType?.hasOwnProperty(item.type)) {
      mentionByType[mType].push(item)
    } else {
      // create array for new type
      mentionByType[mType] = []
      // and add this item
      mentionByType[mType].push(item)
    }
  })

  return {
    mentionByType,
    featuredMentions
  }
}

function renderMentionSectionForType(key: MentionType, items: Mention[]) {
  // do not render accordion/section if no items
  if (items.length===0) return null
  return (
    <Accordion
      data-testid='software-mentions-by-type'
      key={key}
      sx={{
        boxShadow: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        // custom color from legacy RSD
        backgroundColor: '#3a3e40',
        // remove line above the accordion
        '&:before': {
          height: '0px'
        },
        '&:last-child': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        }
      }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel1-content-${key}`}
        id={`panel1-header-${key}`}
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#222425',
          padding: '0rem',
          '&:hover': {
            opacity:0.95
          }
        }}
      >
        <Badge
          badgeContent={items.length}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              right: '-1rem',
              top: '0.25rem',
              border: '2px solid',
              borderColor: 'common.white'
            },
          }}
        >
          <div className="text-xl">{mentionType[key] ?? 'Other mentions'}</div>
        </Badge>
      </AccordionSummary>
      <AccordionDetails sx={{
        // set max height to avoid large shifts
        maxHeight: '30rem',
        //avoid resizing when scrollbar appears
        overflow: 'overlay',
        padding:'0rem 0rem'
      }}>
        {renderMentionItemsForType(items)}
      </AccordionDetails>
    </Accordion>
  )
}

function renderMentionItemsForType(items: Mention[]) {
  if (items.length === 0) return null
  return (
    <ul>
      {
        items.sort((a, b) => {
          // sort mentions on date, newest at the top
          return sortOnDateProp(a,b,'date','desc')
        }).map((item, pos) => {
          return (
            <li key={pos} className="p-4 hover:bg-grey-200 hover:text-black">
              {item.url ?
                <Link href={item.url} passHref>
                  <a className="hover:text-black" target="_blank">
                    <div>{item.title}</div>
                    <div>{isoStrToLocalDateStr(item.date)}</div>
                  </a>
                </Link>
                :<div>
                  <div>{item.title}</div>
                  <div>{isoStrToLocalDateStr(item.date)}</div>
                </div>
              }
            </li>
          )
        })
      }
    </ul>
  )
}
