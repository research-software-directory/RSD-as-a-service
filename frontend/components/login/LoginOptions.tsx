import {signIn} from 'next-auth/react'

import Image from 'next/image'
import Button from '@mui/material/Button'

import LogoSURF from '../../assets/LogoSURFconext.png'
// import GitHubIcon from '@mui/icons-material/GitHub';
// import OrcidIcon from './OrcidIcon';

function signInWith(provider:string){
  signIn(provider,{
    callbackUrl:"http://localhost:3000/user/profile"
  })
}

export default function LoginOptions() {
  return (
    <section className="grid gap-4 mx-auto mt-20 w-1/4">
      <h2>Login with</h2>
      <Button
        onClick={()=>signInWith('surfconext')}>
        <Image src={LogoSURF} alt="Login with SURFconext" />
        {/* SURFConext */}
      </Button>
      {/* <Button
        variant="outlined"
        autoFocus
        sx={{textTransform:'inherit'}}
        onClick={()=>signInWith('github')}>
        <GitHubIcon sx={{marginRight:'1rem'}}/>
          GitHub
      </Button>
      <Button variant="outlined" sx={{textTransform:'inherit'}}
        onClick={()=>signInWith('orcid')}>
        <OrcidIcon className="h-6 mr-4" />
        ORCID
      </Button>
      <Button variant="outlined" sx={{textTransform:'inherit'}}
        onClick={()=>signInWith('azure-ad')}>
        Azure AD
      </Button>
      <Button variant="outlined" sx={{textTransform:'inherit'}}
        onClick={()=>router.push("/signin")}>
        Email and Password
      </Button> */}
    </section>
  )
}
