import Button from '@mui/material/Button'

import {softwareInformation as config} from '../editSoftwareConfig'

export default function GetKeywordsFromDoi(
  {onClick, title}: { onClick: () => void,title?:string}
) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      title={title ?? ''}
    >
      { config.importKeywords.label }
    </Button>
  )
}
