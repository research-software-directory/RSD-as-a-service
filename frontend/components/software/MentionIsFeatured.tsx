import Link from 'next/link'
import {isoStrToLocalDateStr} from '../../utils/dateFn'
import ImageAsBackground from '../layout/ImageAsBackground'
import {MentionForSoftware} from '../../types/MentionType'

export default function MentionIsFeatured({mention}: { mention: MentionForSoftware }) {
  // do not render if no data
  if (!mention) return null

  return (
    <Link href={mention.url} passHref>
      <a data-testid="software-mention-is-featured"
        target="_blank"
        rel="noreferrer"
      >
        <article className="mb-8 md:flex">
          <ImageAsBackground className="flex-1 h-[17rem]" src={mention.image} alt={mention.title} />
          <div className="flex flex-col py-4 px-0 md:py-0 md:px-6 md:flex-1 lg:flex-[2] text-white">
              <h3 className="text-[2rem] mb-4 text-primary leading-10">
                {mention.title}
              </h3>
            <div>By {mention.author}</div>
            <div>{isoStrToLocalDateStr(mention.date)}</div>
            {/* <div>Read the blog</div> */}
          </div>
        </article>
      </a>
    </Link>
  )
}
