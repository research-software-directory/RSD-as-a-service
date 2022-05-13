import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'

import {contributorInformation as config} from '../editSoftwareConfig'

export default function GetContributorsFromDoi(
  {onClick, title}: { onClick: () => void,title?:string}
) {
  return (
    <Button
      startIcon={<DownloadIcon />}
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
