import Button from '@mui/material/Button'
import SaveIcon from '@mui/icons-material/Save'

import StickyHeader from '../../layout/StickyHeader'

export default function StickyHeaderEditSoftware({brand_name, isCancelDisabled, isSaveDisabled, onCancel}:
  { brand_name: string, isCancelDisabled:boolean, isSaveDisabled:boolean, onCancel:Function }) {
  return (
    <StickyHeader className="flex py-4 w-full bg-white md:pl-[3rem]">
      <h1 className="flex-1 text-primary">{brand_name}</h1>
      <div>
        {/* <Button
          tabIndex={1}
          type="button"
          onClick={()=>onCancel()}
          disabled={isCancelDisabled}
          sx={{
            marginRight:'2rem'
          }}
        >
          Cancel
        </Button> */}
        <Button
          tabIndex={0}
          type="submit"
          variant="contained"
          sx={{
            // overwrite tailwind preflight.css for submit type
            '&[type="submit"]:not(.Mui-disabled)': {
              backgroundColor:'primary.main'
            }
          }}
          endIcon={
            <SaveIcon />
          }
          disabled={isSaveDisabled}
        >
          Save
        </Button>
      </div>
    </StickyHeader>
  )
}
