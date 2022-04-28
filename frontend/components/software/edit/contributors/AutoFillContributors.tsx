import Button from '@mui/material/Button'

import {contributorInformation as config} from '../editSoftwareConfig'

export default function AutoFillContributors(
  {onClick}: { onClick: () => void }
) {
  return (
    <section className="flex items-center mb-4">
      <Button
        variant="outlined"
        onClick={onClick}
      >
        { config.findContributor.autofill }
      </Button>
    </section>
  )
}
