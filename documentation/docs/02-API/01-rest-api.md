# REST API

The REST API is exposed on the `/api/v1` endpoint. It uses PostgREST.

## PostgREST

We use PostgREST for the API, see the [documentation](https://postgrest.org/en/v11.0/references/api.html) on how to use the API.

:::tip
You can use REST API for reading non-private data without authentication
:::


## Swagger

Swagger documentation is available on the `/swagger` endpoint.
You can visit the [Swagger UI here](https://research-software-directory.org/swagger/).

## API Usage via Access Tokens

When wanting to use the REST API via an API access token (as described in [User settings](/users/user-settings#api-access-tokens)), requests need to be made to the endpoint `/api/v2`, which mirrors `/api/v1`.
