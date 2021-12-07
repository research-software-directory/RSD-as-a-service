import {signIn} from 'next-auth/react'
import router from 'next/router'

import Button from '@mui/material/Button'
import GitHubIcon from '@mui/icons-material/GitHub';

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
        variant="outlined"
        autoFocus
        sx={{textTransform:'inherit'}}
        onClick={()=>signInWith('github')}>
        <GitHubIcon sx={{marginRight:'1rem'}}/>
          GitHub
      </Button>
      <Button variant="outlined" sx={{textTransform:'inherit'}}
        onClick={()=>signInWith('orcid')}>
        ORCID
      </Button>
      <Button variant="outlined" sx={{textTransform:'inherit'}}
        onClick={()=>signInWith('surfconext')}>
        SURFconext
      </Button>
      <Button variant="outlined" sx={{textTransform:'inherit'}}
        onClick={()=>router.push("/signin")}>
        Email and Password
      </Button>
    </section>
  )
}