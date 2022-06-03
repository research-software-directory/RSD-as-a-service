import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DownloadIcon from '@mui/icons-material/Download'

import {softwareInformation as config} from '../editSoftwareConfig'

export default function GetKeywordsFromDoi(
  {onClick, title, loading=false}:
  {onClick: () => void, title?: string, loading?: boolean}
) {

  function renderStartIcon() {
    if (loading) {
      return <CircularProgress data-testid="circular-loader" color="inherit" size={20} />
    }
    return <DownloadIcon />
  }

  return (
    <Button
      startIcon={renderStartIcon()}
      onClick={onClick}
      title={title ?? ''}
    >
      { config.importKeywords.label }
    </Button>
  )
}
