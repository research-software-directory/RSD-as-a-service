# Authentication module

This modules handles authentication from third parties using oAuth2 and OpenID.

## Environment variables

It requires the following variables at run time.

```env
# connection to backend
POSTGREST_URL=

# SURFconext
NEXT_PUBLIC_SURFCONEXT_CLIENT_ID=
NEXT_PUBLIC_SURFCONEXT_REDIRECT=
AUTH_SURFCONEXT_CLIENT_SECRET=

# JWT secret for postgREST
PGRST_JWT_SECRET=
```
