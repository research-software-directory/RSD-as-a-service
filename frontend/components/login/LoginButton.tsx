import {useAuth} from '~/auth'
import {userMenuItems} from '~/config/userMenuItems'
import {getRedirectUrl} from '~/utils/loginHelpers'
import UserMenu from '~/components/layout/UserMenu'


export default function LoginButton() {

  const {session} = useAuth()
  const status = session?.status || 'loading'

  // todo: provisional redirect to Surf directly
  async function redirectToSurf() {
    const url = await getRedirectUrl('surfconext')
    if (url) {
      window.location.href = url
    }
  }

  if (status === 'loading') {
    return null
  }
  if (status === 'authenticated') {
    //   // when user authenticated
    //   // we show user menu with the avatar and user specific options
    return (
      <UserMenu
        name='No Name'
        menuOptions={userMenuItems}
      />
    )
  } else {
    return (
      <a onClick={redirectToSurf}>
        Sign in
      </a>)
  }
}
