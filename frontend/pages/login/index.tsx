import Head from 'next/head'
import ContentInTheMiddle from '../../components/layout/ContentInTheMiddle'
import LoginOptions from '../../components/login/LoginOptions'

export default function LoginPage(){
  return (
    <>
      <Head>
        <title>Login | Research Software Directory</title>
      </Head>
      <ContentInTheMiddle>
        <LoginOptions />
      </ContentInTheMiddle>
    </>
  )
}
