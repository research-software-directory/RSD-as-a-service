// next-auth API
// documentation at https://next-auth.js.org/getting-started/example
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GitlabProvider from "next-auth/providers/gitlab"
import AzureADProvider from "next-auth/providers/azure-ad";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
    }),
    AzureADProvider({
      // HAS A BUG, see issue https://github.com/nextauthjs/next-auth/issues/3052
      // it requires "openid-client": "^5.0.2",
      // I manually updated node_modules
      clientId: process.env.AUTH_AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AUTH_AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
    }),
    // Gitlab is not working properly !!!
    // GitlabProvider({
    //   clientId: process.env.AUTH_GITLAB_CLIENT_ID,
    //   clientSecret: process.env.AUTH_GITLAB_CLIENT_SECRET,
    // }),
    // ---------------------------------
    // ORCID oAuth2 + OICD provider
    // ---------------------------------
    {
      id: "orcid",
      name: "ORCID",
      type: "oauth",
      wellKnown: "https://orcid.org/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile"
        }
      },
      // when set to false causes the error openid-client
      // oauth_callback_error id_token detected in the response, you must use client.callback() instead of client.oauthCallback()
      idToken: true,
      checks: ["pkce", "state"],
      clientId: process.env.AUTH_ORCID_CLIENT_ID,
      clientSecret: process.env.AUTH_ORCID_CLIENT_SECRET,
      profile(profile) {
        // console.log("nextAuth.provider.ORCID.profile...", profile)
        return {
          ...profile,
          // ID is required by auth-next.client
          // for ORCID we use sub which is base ORCID
          id: profile.sub,
          // we need to construct name
          // name: `${profile?.given_name} ${profile?.family_name}`,
          // store orcid incl. website url
          // orcid: `${profile?.iss}/${profile?.sub}`
        }
      },
    },
    // ---------------------------------
    // SURFconext oAuth2 + OICD provider
    // ---------------------------------
    {
      id: "surfconext",
      name: "SURFconext",
      type: "oauth",
      wellKnown: "https://connect.test.surfconext.nl/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile",
          // claims property is used to request adding claims to id_token
          // this is not prefered approach.
          // claims: "{\"id_token\":{\"name\":null,\"eduperson_affiliation\":null,\"eduperson_entitlement\":null,\"email\":null,\"eduperson_orcid\":null}}",
          prompt: "login"
        }
      },
      /**
       * If set to `true`, the user information will be extracted
       * from the `id_token` claims, instead of making a request to the `userinfo` endpoint.
       * `id_token` is usually present in OpenID Connect (OIDC) compliant providers.
       * [`id_token` explanation](https://www.oauth.com/oauth2-servers/openid-connect/id-tokens)
       */
      idToken: true,
      checks: ["pkce", "state"],
      clientId: process.env.AUTH_SURFCONEXT_CLIENT_ID,
      clientSecret: process.env.AUTH_SURFCONEXT_CLIENT_SECRET,
      profile(profile, tokens) {
        // console.log("nextAuth.provider.SURFconext.profile...profile:", profile)
        // console.log("nextAuth.provider.SURFconext.profile...tokens:", tokens)
        const fullProfile = {
          ...profile,
          // ID is required by auth-next.client
          // for SURFconext we use sub which is base SURFconext
          id: profile.sub,
        }
        // console.log("nextAuth.provider.SURFconext.profile...fullProfile:", fullProfile)
        return fullProfile
      }
    }
  ],
  pages:{
    signIn:"/login",
    signOut:"/logout"
  },
  callbacks:{
    /*
      jwt callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated
      (i.e whenever a session is accessed in the client).
      see https://next-auth.js.org/configuration/callbacks#jwt-callback
    */
    async jwt(props) {
      // Note! user seem to be constructed in the profile function of the provider
      const { token, account, user, profile } = props

      // console.log("nextAuth.callbacks.jwt...props...", props)
      // console.log("nextAuth.callbacks.jwt...token...", token)
      // console.log("nextAuth.callbacks.jwt...account...", account)

      if (profile){
        token.profile = profile
      }
      return token
    },
    /*
      session callback is called whenever a session is checked.
      By default, only a subset of the token is returned for increased security.
      If you want to make something available you added to the token through the jwt() callback,
      you have to explicitly forward it here to make it available to the client.
      see https://next-auth.js.org/configuration/callbacks#session-callback
    */
    async session(props) {
      const {session,token} = props
      // console.log("nextAuth.callbacks.session...props...", props)
      // console.log("nextAuth.callbacks.session...session...", session)
      // console.log("nextAuth.callbacks.session...token...", token)
      // console.log("nextAuth.callbacks.session...user...", user)

      if (session && session?.user && token){
        session.info = token
      }
      // send properties to the client, like an access_token from a provider.
      // session.accessToken = token.accessToken
      return session
    }
  }
  // debug:false
})
