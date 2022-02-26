import {useState} from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Badge from '@mui/material/Badge'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import SoftwareMentionItem from './SoftwareMentionItem'
import {mentionType,MentionType,MentionForSoftware} from '../../../../types/MentionType'
import {sortOnDateProp} from '../../../../utils/sortFn'
import useMentionsForSoftware from '../../../../utils/useMentionsForSoftware'
import ContentLoader from '../../../layout/ContentLoader'
import {clasifyMentionsByType} from '../../../../utils/editMentions'
import {useEffect} from 'react'
import SoftwareMentionCategories from './SoftwareMentionCategories'
import {getMentionsForSoftwareOfType} from '../../../../utils/editMentions'
import EditSectionTitle from '../EditSectionTitle'
import SoftwareMentionList from './SoftwareMentionList'

export type MentionByType={
  [key:string]: MentionForSoftware[]
}

type SoftwareMentionByTypeProps = {
  software: string | undefined
  token: string
  // reload: boolean
  onCountChange: (count: number) => void
  // onDelete: (mention:MentionForSoftware) => void
}

export default function SoftwareMentionsByType({software, token, onCountChange}:
  SoftwareMentionByTypeProps) {
  const [category, setCategory] = useState<MentionType>('attachment')
  const [mentions, setMentions] = useState<MentionForSoftware[]>([])

  useEffect(() => {
    let abort = false
    async function getItems(software:string,token:string,category:MentionType) {
      const resp = await getMentionsForSoftwareOfType({
        software,
        token,
        type:category,
        frontend:true
      })
      // stop on abort
      if (abort===true) return
      setMentions(resp ?? [])
    }
    if (typeof software!='undefined' && category && software && token) {
      getItems(software,token,category)
    }
    return ()=>{abort=true}
  },[category,software,token])

  console.group('SoftwareMentionsByType')
  console.log('category...', category)
  console.log('software...', software)
  console.log('mentions...', mentions)
  // console.log('mentionByType...', mentionByType)
  // console.log('mentionTypes...', mentionTypes)
  console.groupEnd()

  // if loading show loader
  // if (loading) return (
  //   <ContentLoader />
  // )

  return (
    <section className="flex py-8">
      <div>
        <EditSectionTitle
          title="Category"
        />
        <SoftwareMentionCategories
          category={category}
          itemCount={mentions.length}
          onCategoryChange={(category)=>setCategory(category)}
        />
      </div>
      <div className="flex-1">
        <EditSectionTitle
          title={mentionType[category]}
        />
        <SoftwareMentionList
          items={mentions}
          token={token}
        />
      </div>
    </section>
  )


}
