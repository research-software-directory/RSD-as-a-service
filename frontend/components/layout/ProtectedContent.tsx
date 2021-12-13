import { useSession } from "next-auth/react"
import ContentInTheMiddle from "./ContentInTheMiddle"

export default function ProtectedContent({children}:{children:any}) {
  const {status} = useSession()
  if (status==="authenticated"){
    return children
  }
  // not authenticated
  return (
    <ContentInTheMiddle>
      <h1 className="text-error">401 UNAUTHORIZED</h1>
    </ContentInTheMiddle>
  )
}