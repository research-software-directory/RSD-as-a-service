import { isLoggedIn } from '~/api/auth'

export default function ({ redirect }) {
  console.log('auth.middleware...redirect...', redirect)
  console.log('auth.middleware...isLoggedIn...', isLoggedIn.value)
  if (!isLoggedIn.value) {
    console.error('Protected Route...not logged in..redirect to root')
    return redirect('/')
  }
}
