import {useEffect, useState, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import {Alert, AlertTitle} from '@mui/material'

import {MentionForSoftware, MentionType} from '../../../../types/MentionType'
import {sortOnDateProp} from '../../../../utils/sortFn'

import SoftwareMentionItem from './SoftwareMentionItem'
import {removeMentionForSoftware} from '../../../../utils/editMentions'
import editSoftwareContext from '../editSoftwareContext'
import useSnackbar from '../../../snackbar/useSnackbar'

export default function SoftwareMentionList({items,token}:
  { items: MentionForSoftware[], token: string }) {
  const {showSuccessMessage, showErrorMessage} = useSnackbar()
  const {pageState} = useContext(editSoftwareContext)
  const {software} = pageState
  const [mentions, setMentions] = useState(items)

  useEffect(() => {
    setMentions(items)
  },[items])

  function removeFromMentionList(pos: number) {
    const newList = [
      ...mentions.slice(0, pos),
      ...mentions.slice(pos + 1)
    ]
    setMentions(newList)
  }

  async function removeMention(pos: number) {
    debugger
    const mention = mentions[pos]
    if (mention?.id && software?.id) {
      const resp = await removeMentionForSoftware({
        mention: mention?.id,
        software:software?.id,
        token
      })
      if (resp.status === 200) {
        removeFromMentionList(pos)
        showSuccessMessage(`Removed mention from ${software?.brand_name}`)
      } else {
        showErrorMessage(`Failed to remove mention from ${software?.brand_name}`)
      }
    } else {
      showErrorMessage(`Failed to remove mention from ${software?.brand_name}`)
    }
  }

  if (items.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No mentions in this category</AlertTitle>
        Add one using <strong>search for mentions</strong> at the top of the screen.
      </Alert>
    )
  }

  return (
    <>
      {mentions.sort((a, b) => {
        // sort mentions on date, newest at the top
        return sortOnDateProp(a, b, 'date', 'desc')
      }).map((item, pos) => {
        return (
          <div key={pos} className="p-4 hover:bg-grey-200 hover:text-black">
            <SoftwareMentionItem
              pos={pos}
              item={item}
              onDelete={removeMention}
            />
          </div>
        )
      })}
    </>
  )
}
