
import CategoryIcon from '@mui/icons-material/Category'
import { CategoriesForSoftware, CategoryID } from '../../types/SoftwareTypes'
import TagChipFilter from '../layout/TagChipFilter'
import { ssrSoftwareUrl } from '~/utils/postgrestUrl'

const interleave = <T,>(arr: T[], value: T) => arr.reduce((result, element, index, array) => {
    result.push(element);
    if (index < array.length - 1) {
      result.push(value);
    }
    return result;
  }, [] as T[]);



export default function SoftwareCategries({ categories }: { categories: CategoriesForSoftware }) {

  function renderItems() {
    if (categories.paths.length === 0) {
      return (
        <i>No keywords avaliable</i>
      )
    }
    return (
      <div className="py-1">
        {categories.paths.map((path, index) => {
          //const url = ssrSoftwareUrl({ keywords: [item.keyword] })
          const x = path.map((cat_id: CategoryID) => <span>{categories.category_entries[cat_id].short_name}</span>)
          return <span className='px-2 mb-2 bg-neutral-100 inline-block'>{interleave(x, <span className="px-2">::</span>)}</span>
        })}
      </div>
    )
  }

  return (
    <>
      <div className="pt-8 pb-2">
        <CategoryIcon color="primary" />
        <span className="text-primary pl-2">Categories</span>
      </div>
      {renderItems()}
    </>
  )
}
