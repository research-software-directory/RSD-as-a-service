import Link from 'next/link'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {isoStrToLocalDateStr} from '../../../../utils/dateFn'
import {MentionForSoftware} from '../../../../types/MentionType'

export default function SoftwareMentionItem({item, pos, onDelete}:
  { item: MentionForSoftware, pos: number, onDelete:(pos:number)=>void }) {

  function renderLink() {
    if (item?.url) {
      return (
        <Link href={item.url} passHref>
          <a target="_blank" rel="noreferrer">
            <IconButton
              title="Open mention in new tab"
              >
              <LinkIcon />
            </IconButton>
          </a>
        </Link>
      )
    }
    return null
  }

  return (
    <div data-testid="software-mention-item-body" className="flex justify-start">
      <div className="min-w-[1rem]">{pos+1}.</div>
      <div className='pl-4 flex-1'>
        <div>{item.title}</div>
        <div>{isoStrToLocalDateStr(item.date)}</div>
      </div>
      <div className="flex justify-center items-center">
        {renderLink()}
        <IconButton
            title="Remove mention"
            onClick={() => {
              onDelete(pos)
            }}
            sx = {{
              marginLeft:'1rem'
            }}
          >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  )
}
