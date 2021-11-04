import { ref, computed } from '@nuxtjs/composition-api'
import { Provider, Session } from '@supabase/gotrue-js'
import { supabase } from '~/plugins/supabase'

// state
const userSession:{value:any}|undefined = ref({})

// Getter
const isLoggedIn = computed(
  () => userSession.value?.user?.aud === 'authenticated'
)

// Actions
// function loginWithGoogle (isDev:boolean) {
//   supabase.auth.signIn({ provider: 'google' }, {
//     redirectTo: isDev ? 'http://localhost:3000' : undefined
//   })
// }

async function loginWithEmail (email:string) {
  console.log('loginWithEmail...init')
  const { user, session, error } = await supabase.auth.signIn({
    email
  })
  if (error) {
    console.error('loginWithEmail...error:', error)
  }
  console.log('loginWithEmail...user,session', user, session)
}

async function logout () {
  await supabase.auth.signOut()
}

const setUserSession = (session:Session) => {
  userSession.value = session
}

// Handle Auth user changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('onAuthStateChange.event...', event)
  console.log('onAuthStateChange.session...', session)
  userSession.value = session
})

async function loginWithProvider (provider:Provider) {
  const { user, session, error } = await supabase.auth.signIn({ provider }, {
    redirectTo: 'http://localhost:3000/admin',
    scopes: 'openid'
  })
  if (error) {
    console.error(`loginWith...${provider}...failed: `, error)
  }
  console.log(`loginWith...${provider}...user,session:`, user, session)
}

async function loginWithGithub () {
  await loginWithProvider('github')
}

async function loginWithAzure () {
  await loginWithProvider('azure')
}

export { userSession, isLoggedIn, setUserSession, loginWithGithub, loginWithAzure, logout, loginWithEmail }
