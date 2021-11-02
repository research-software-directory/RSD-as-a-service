import { ref, computed } from '@nuxtjs/composition-api'
import { supabase } from '~/plugins/supabase'

// state
const userSession = ref({})

// Getter
const isLoggedIn = computed(
  () => userSession.value?.user?.aud === 'authenticated'
)

// Actions
function loginWithGoogle (isDev:boolean) {
  supabase.auth.signIn({ provider: 'google' }, {
    redirectTo: isDev ? 'http://localhost:3000' : undefined
  })
}

async function loginWithEmail (email:string) {
  console.log('✉️ requesting email...')
  const { user, session, error } = await supabase.auth.signIn({
    email
  })
  if (error) {
    console.log('🎹', error)
  }
  console.log('🎹', user, session)

  // supabase.auth.signIn({ provider: 'google' }, {
  //   redirectTo: isDev ? 'http://localhost:3000' : null
  // })
}

async function logout () {
  await supabase.auth.signOut()
}

const setUserSession = (session) => {
  userSession.value = session
}

// Handle Auth user changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Event', event)
  console.log('User ', session)
  userSession.value = session
})
export { userSession, isLoggedIn, setUserSession, loginWithGoogle, logout, loginWithEmail }
