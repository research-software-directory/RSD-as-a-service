
import TagListItem from '../layout/TagListItem'

export default function ProjectTechnologies({topics}: { topics: string[] }) {
  if (topics.length === 0) {
    return (
      <div>
        <h4 className="text-primary py-4">Technologies</h4>
        <i>Not specified</i>
      </div>
    )
  }

  function renderTags() {
    return topics.map(item => {
      return <TagListItem key={item} label={item} />
    })
  }

  return (
    <div>
      <h4 className="text-primary py-4">Topics</h4>
      {renderTags()}
    </div>
  )
}
