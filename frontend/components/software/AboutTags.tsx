import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import {Tag} from '../../types/SoftwareTypes'
import TagListItem from '../layout/TagListItem'

export default function AboutTags({tags = []}: { tags: Tag[] }) {

  function renderTags() {
    if (tags.length === 0) {
      return (
        <i>No tags avaliable</i>
      )
    }
    return (
      <ul className="flex flex-wrap py-1">
        {tags.map((item, pos) => {
          return <TagListItem key={pos} label={item.tag}/>
        })}
      </ul>
    )
  }

  return (
    <>
    <div className="pt-8 pb-2">
      <LocalOfferIcon color="primary" sx={{transform:'rotate(90deg)'}} />
      <span className="text-primary pl-2">Tags</span>
    </div>
    {renderTags()}
    </>
  )
}
