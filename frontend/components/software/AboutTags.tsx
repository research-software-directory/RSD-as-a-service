import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import {Tag} from '../../types/SoftwareTypes'


export default function Tags({tags = []}: { tags: Tag[] }) {

  function renderTags() {
    if (tags.length === 0) {
      return (
        <i>No tags avaliable</i>
      )
    }
    return (
      <ul className="flex flex-wrap py-1">
        {tags.map((item, pos) => {
          return <li key={pos} className="m-[0.125rem] px-4 py-2 bg-grey-200">{ item.tag }</li>
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
