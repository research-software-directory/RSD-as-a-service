
import CategoryIcon from '@mui/icons-material/Category'
import { CategoriesForSoftware, CategoryID } from '../../types/SoftwareTypes'
import TagChipFilter from '../layout/TagChipFilter'
import { ssrSoftwareUrl } from '~/utils/postgrestUrl'
import logger from '../../utils/logger'

const interleave = <T,>(arr: T[], createElement: (index: number) => T) => arr.reduce((result, element, index, array) => {
    result.push(element);
    if (index < array.length - 1) {
      result.push(createElement(index));
    }
    return result;
  }, [] as T[]);



export default function SoftwareCategries({ categories }: { categories: CategoriesForSoftware }) {

  function renderItems() {
    logger(JSON.stringify(categories))
    if (categories.length === 0) {
      return (
        <i>No categories assigned</i>
      )
    }
    return (
      <div className="py-1">
        {categories.map((path, index) => {
          const chunks = path.map((category) => <span key={category.id}>{category.short_name}</span>)
          return <div key={index} className='mb-2'><span className='px-2 py-1 bg-neutral-100'>{interleave(chunks, (index) => <span key={index} className="px-2">::</span>)}</span></div>
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
