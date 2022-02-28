import {mentionTypeSingular,MentionItem, MentionEditType} from '../../../../types/MentionType'
import {isoStrToLocalDateStr} from '../../../../utils/dateFn'

export default function FindMentionItem({mention}: { mention: MentionItem }) {

  function renderDateAndAuthor() {
    if (mention.date && mention.author) {
      return (
        <>
          <div>
            {isoStrToLocalDateStr(mention.date)}
          </div>
          <div className="flex-1 text-right pr-4">
            {mention.author}
          </div>
        </>
      )
    }
    if (mention.date) {
      return isoStrToLocalDateStr(mention.date)
    }
    if (mention.author) {
      return mention.author
    }
  }

  return (
    <div>
      {mention.type ?
        <div className="pr-4">
          <strong>{mentionTypeSingular[mention.type as MentionEditType]}</strong>
        </div>
        :null
      }
      <div>
        {mention.title}
      </div>
      <div className="flex content-between">
        {renderDateAndAuthor()}
      </div>
      {mention.url ?
        <div>
          {mention.url}
        </div>
        :null
      }
    </div>
  )
}
