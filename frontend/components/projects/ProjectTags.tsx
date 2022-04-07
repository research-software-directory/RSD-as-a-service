
import TagListItem from '../layout/TagListItem'

export default function ProjectTags({title,tags}: {title:string, tags: string[] }) {

  function renderTags() {
    if (tags.length === 0) {
      return <i>Not specified</i>
    }
    return (
      <ul className="flex flex-wrap py-1">
        {
          tags.map(item => {
            return <TagListItem key={item} label={item} className="bg-grey-400" />
          })
        }
      </ul>
    )
  }

  return (
    <div>
      <h4 className="text-primary py-4">{title}</h4>
      {renderTags()}
    </div>
  )
}
