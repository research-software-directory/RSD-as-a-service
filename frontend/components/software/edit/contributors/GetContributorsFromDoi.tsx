import Button from '@mui/material/Button'

import {contributorInformation as config} from '../editSoftwareConfig'

export default function GetContributorsFromDoi(
  {onClick, title}: { onClick: () => void,title?:string}
) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      title={title ?? ''}
      sx={{
        marginTop: '1rem'
      }}
    >
      { config.importContributors.label }
    </Button>
  )
}
