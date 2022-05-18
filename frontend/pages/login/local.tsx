import {app} from '~/config/app'
import Head from 'next/head'
import DefaultLayout from '~/components/layout/DefaultLayout'
import PageTitle from '~/components/layout/PageTitle'
import {Button, TextField} from '@mui/material'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'

export default function LoginFailed() {

  return (
    <DefaultLayout>
      <Head>
        <title>Login | {app.title}</title>
      </Head>
      <PageTitle title="Login">
      </PageTitle>
      <ContentInTheMiddle>
        <form action="/auth/login/local" method="post">
          <TextField required inputProps={{pattern: '\\w+'}} id="username-field" label="Username" variant="standard" name="sub"/>
          <Button variant="contained" type='submit'>Login</Button>
        </form>

      </ContentInTheMiddle>
    </DefaultLayout>
  )
}
