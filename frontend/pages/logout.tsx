import type {NextPage} from 'next'
import {signOut,useSession} from 'next-auth/react'
import {useEffect} from 'react'
import DefaultLayout from "../components/layout/DefaultLayout"


const LogoutPage: NextPage = () => {
  const {data} = useSession()

  useEffect(()=>{
    if (data?.user){
      signOut()
    }
  })

  return (
   <DefaultLayout>
     <section className="card-centered">
     {
       data?.user ?
        <button className="btn btn-indigo p-4 rounded" onClick={()=>signOut()} >SignOut</button>
        :
        <>
          <h1>Logout</h1>
          <h3>You are logged out!</h3>
        </>
     }
     </section>
   </DefaultLayout>
  )
}

export default LogoutPage
