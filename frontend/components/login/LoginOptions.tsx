import Image from 'next/image'
import Button from '@mui/material/Button'

import {getRedirectUrl} from '~/utils/loginHelpers'
import LogoSURF from '~/assets/logos/LogoSURFconext.png'
import LogoHelmholtzAAI from '~/assets/logos/LogoHelmholtzAAI.svg'

export default function LoginOptions() {
  // redirect to SURFConext oAuth2 page
  async function redirectToSurf(){
    const url = await getRedirectUrl('surfconext')
    if (url){
      window.location.href = url
    }
  }

  // redirect to Helmholtz AAI oAuth2 page
  async function redirectToHelmholtzAai(){
    const url = await getRedirectUrl('helmholtzaai')
    if (url){
      window.location.href = url
    }
  }

  return (
    <section className="grid gap-4 mx-auto mt-20 w-1/4">
      <h2>Login with</h2>
      <Button
        onClick={redirectToSurf}>
        <Image src={LogoSURF} alt="Login with SURFconext" />
      </Button>
      <Button
        onClick={redirectToHelmholtzAai}>
        <LogoHelmholtzAAI />
      </Button>
    </section>
  )
}
