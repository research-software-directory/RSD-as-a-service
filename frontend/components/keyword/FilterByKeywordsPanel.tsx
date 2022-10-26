import {TextField} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

export default function FilterByKeywordsPanel({onFilterChange}: any) {

  let tags = ['keyword 1', 'keyword 2', 'keyword 3', 'keyword 4']

  function setTags(tag: string[]) {
    // todo sent to the parent component the trigger
    tags = tag
    onFilterChange(tags)
  }

  return (
    <div>
<div className="text-lg">Filter by Keywords</div>

    <Autocomplete
      className="py-5"
      multiple
      id="tags-outlined"
      options={tags}
      defaultValue={[...tags]}
      freeSolo
      autoSelect
      onChange={(e) => setTags([...tags, e.target.value])}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Filter by keywords"
          placeholder="Keyword"
          value={tags}
        />
      )}
    />

      {tags.map((tag) => (<div className="mb-3 cursor-pointer hover:text-primary">{tag}</div>))}
    </div>
  )
}
