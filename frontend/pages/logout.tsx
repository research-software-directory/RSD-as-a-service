import type {NextPage} from 'next'
import {signOut,useSession} from 'next-auth/react'
import {useEffect} from 'react'
import DefaultLayout from "../components/layout/DefaultLayout"


const LogoutPage: NextPage = () => {
  const {data} = useSession()

  useEffect(()=>{
    if (data && data.user){
      // console.log("signing you out!!!")
      signOut()
    }
  })

  if (data && data.user){
    return (
      <DefaultLayout>
        <section className="card-centered">
          Signing you out...
        </section>
      </DefaultLayout>
    )
  }

  function getContent(){
    if (data && data.user){
      return (
        <button className="btn btn-indigo p-4 rounded" onClick={()=>signOut()} >SignOut</button>
      )
    }
    return (<h3>You are logged out!</h3>)
  }

  return (
   <DefaultLayout>
      <section className="card-centered">
        <h1>Logout</h1>
        {getContent()}
      </section>
   </DefaultLayout>
  )
}

export default LogoutPage
