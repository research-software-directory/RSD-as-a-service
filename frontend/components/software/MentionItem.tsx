import Link from 'next/link'
import LinkIcon from '@mui/icons-material/Link'

import {isoStrToLocalDateStr} from '../../utils/dateFn'
import {MentionForSoftware} from '../../types/MentionType'

export default function MentionItem({item, pos}: {item: MentionForSoftware, pos:number}) {

  function renderItemBody() {
    return (
      <div data-testid="software-mention-item-body" className="flex justify-start">
        <div className="min-w-[1rem]">{pos}.</div>
        <div className='pl-4 flex-1'>
          <div>{item.title}</div>
          <div>{isoStrToLocalDateStr(item.date)}</div>
        </div>
        <div className="flex justify-center items-center">
          {item?.url ? <LinkIcon /> : null}
        </div>
      </div>
    )
  }

  if (item?.url) {
    return (
      <Link href={item.url} passHref>
        <a className="hover:text-black" target="_blank" rel="noreferrer">
          {renderItemBody()}
        </a>
      </Link>
    )
  }
  return renderItemBody()
}
