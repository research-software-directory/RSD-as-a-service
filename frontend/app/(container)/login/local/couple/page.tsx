import {Metadata} from 'next'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import {app} from '~/config/app'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'

// using new app folder approach
export const metadata: Metadata = {
  title: `Couple local account | ${app.title}`,
  description: 'Couple local account to RSD for test purposes',
}

export default async function CoupleLocalAccountPage() {
  return (
    <ContentInTheMiddle>
      <BaseSurfaceRounded className="p-12">
        <h1 className="pb-2">Couple local account</h1>
        <p className="text-warning">Demo and test RSD only!</p>
        <form
          action="/auth/couple/local"
          method="post"
          className="flex gap-8 py-8 items-center justify-center"
        >
          <TextField
            required
            slotProps={{
              htmlInput: {pattern: '\\w+'}} // NOSONAR
            }
            id="username-field"
            label="Username"
            variant="standard"
            name="sub"
          />
          <Button
            variant="contained"
            type='submit'
          >
            Login
          </Button>
        </form>
      </BaseSurfaceRounded>
    </ContentInTheMiddle>
  )
}
