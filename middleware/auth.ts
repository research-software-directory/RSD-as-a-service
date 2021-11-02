import { isLoggedIn } from '~/api/auth'

export default function ({ redirect }) {
  if (!isLoggedIn.value) {
    console.error('Protected Route')
    return redirect('/')
  }
}
