import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

When wanting to use the REST API via an API access token (as described in [User settings](/users/user-settings#api-access-tokens)), requests need to be made to the endpoint `/api/v2`, which mirrors `/api/v1`. You can find all available endpoints and corresponding data fields in [Swagger](https://research-software-directory.org/swagger/).

The token that you copied after generating it, needs to be provided in the `Authorization` header of the request. The value of this header needs to have the form `Bearer <token>`, where the `Bearer` keyword is case insensitive and where you replace `<token>` with your token.

#### Example 1: Get your software entries

<Tabs groupId="example-technology">
<TabItem value="curl" label="curl">
        ```bash
        #!/bin/bash

        API_URL="https://research-software-directory.org/api/v2"
        TOKEN="YOUR-ACCESS-TOKEN"
        PROFILE_ID="YOUR_PROFILE_ID"

        curl \
                --request POST \
                --header "Authorization: Bearer $TOKEN" \
                --header "Content-Type: application/json" \
                --data '{"maintainer_id": "'$PROFILE_ID'"}' \
                ${API_URL}/rpc/software_by_maintainer
        ```
    </TabItem>
    <TabItem value="python" label="Python">
```Python
# a Python example request
import requests

accessToken = "MY_TOKEN" # replace with your Access Token String
profileID = "MY_PROFILE_ID" # replace with your profile ID, you can find it under Profile Settings

params = {"maintainer_id": profileID}

url = f"https://research-software-directory.org/api/v2/rpc/software_by_maintainer"
headers = {
    'Authorization': f'Bearer {accessToken}',
    'Content-Type': "application/json"
}

response = requests.post(url, json=params, headers=headers)
print(response.json())

```
</TabItem>
</Tabs>

#### Example 2: Create a new software entry

<Tabs groupId="example-technology">
    <TabItem value="curl" label="curl">
        ```bash
        #!/bin/bash

        API_URL="https://research-software-directory.org/api/v2"
        TOKEN="YOUR-ACCESS-TOKEN"

        curl \
                --request POST \
                --header "Authorization: Bearer $TOKEN" \
                --header "Content-Type: application/json" \
                --data '{"slug":"my-software","brand_name":"My Software"}' \
                ${API_URL}/software
        ```
    </TabItem>
    <TabItem value="python" label="Python">
        ```Python
        # a Python example request
        import requests

        accessToken = "MY_TOKEN" # replace with your Access Token String

        url = "https://research-software-directory.org/api/v2/software"
        data = {"slug": "test-software", "brand_name": "TEST-Software", "description": "My new software entry"}
        headers = {
            'Authorization': f'Bearer {accessToken}',
            'Content-Type': "application/json",
            "Prefer": "return=representation"
            }

        response = requests.post(url, json=data, headers=headers)
        print(response.json())
        ```
    </TabItem>
</Tabs>



