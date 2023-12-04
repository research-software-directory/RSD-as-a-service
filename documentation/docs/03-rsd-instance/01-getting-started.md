# Getting started

To run your own RSD instance you can use [deployment.zip file provided in the RSD release](https://github.com/research-software-directory/RSD-as-a-service/releases).

:::warning
To be able to use `deployment.zip` file, you need a machine with Docker and Docker compose. In production you also need a third party authentication service with one or more of the following providers: [Microsoft Entra ID (Azure AD)](/rsd-instance/configurations/#enable-microsoft-entra-id-azure-ad-authentication), [ORCID](/rsd-instance/configurations/#enable-orcid-authentication), [SURFconext](/rsd-instance/configurations/#enable-surfconext-authentication) or [Helmholtz AI](/rsd-instance/configurations/#enable-helmholtz-ai-authentication).
:::

- Unzip `deployment.zip` file. It contains:

  - `.env.example` is an environment example file
  - `CITATION.cff` contains citation information of RSD software.
  - `docker-compose.yml` defines all required RSD services and exposes environment variables used by each service
  - `nginx.conf` basic nginx configuration file.
  - `README.md` contains instructions

- Rename or copy `.env.example` to `.env` and provide the values in the SECRETS section of .env file. Please **do not use special characters** in the `.env` file. For the minimal local setup you should provide values for these variables

```env
POSTGRES_PASSWORD=reallyreallyreallyreallyverysafe
POSTGRES_AUTHENTICATOR_PASSWORD=reallyreallyreallyreallyverysafe
PGRST_JWT_SECRET=reallyreallyreallyreallyverysafe
```

- Start RSD using docker compose

```bash
docker compose up
```

- Visit http://localhost and confirm that the RSD is running

## Login using local account

To be able to login to RSD you need to enable at least one authentication provider. For testing purposes we offer the local account option. To enable it use `LOCAL` value in `RSD_AUTH_PROVIDERS` property in .env file.

```env
# consumed by services: frontend (api/fe)
# provide a list of supported OpenID auth providers
# the values should be separated by semicolon (;)
# if env value is not provided default provider is set to be SURFCONEXT
# if you add the value "LOCAL", then local accounts are enables, USE THIS FOR TESTING PURPOSES ONLY
RSD_AUTH_PROVIDERS=SURFCONEXT;ORCID;LOCAL
```

:::warning
When changing values of environment variables in .env file you need to restart RSD. Use `docker compose down` followed by `docker compose up -d`
:::

At this point you should be able to see RSD instance running. You should also be able to login using Local account by providing any username, for example `Tester`. In order to be able to make changes to RSD please accept the Terms of Service and the Privacy Statement after loging in.

![Login with local account](img/rsd-login-tester.gif)

:::danger
The local account login option is only for test purposes. Local accounts do not require a password and are therefore not safe.
:::

## Log in as RSD administrator

To be able to log in as RSD administrator, the account id of that account needs to be in the database table `admin_account` first.
To do so, [connect to the database](/rsd-instance/database/#connecting-to-the-database) and execute the following query, changing the value of the UUID:

```sql
INSERT INTO admin_account VALUES ('00000000-0000-0000-0000-000000000000');
```

:::tip
A user can see their account ID in their user settings page, which they can find under the `My settings` option in the profile dropdown menu.
:::

If that user is already logged in, they need to log out and log in again before they can make use of their admin rights.

:::tip
When you log in to the RSD as administrator, you will see an additional "Administration" option in the profile dropdown menu.
:::

![Login as rsd admin](img/rsd-login-admin.gif)

## Customizing RSD instance

For customizing and administrating your RSD instance have a look at [configuration](/rsd-instance/configurations/) and [administration](/rsd-instance/administration/).

## Public RSD instance

If you want to run a RSD on a non-localhost machine you will need SSL certificates. The easiest way is to use Linux with Letsencrypt and a public IP address for that purpose. 
Please note that you should take measures to protect a public installation against attackers, in particular as long as the authentication has not been set up properly.

You will need docker, git and make 
```env
sudo curl -sSL https://get.docker.com/ | CHANNEL=stable sh

sudo systemctl enable docker.service
sudo systemctl start docker.service

curl -L https://github.com/docker/compose/releases/download/$(curl -Ls https://www.servercow.de/docker-compose/latest.php)/docker-compose-$(uname -s)-$(uname -m) > /usr/local/bin/docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

sudo apt install git make
```
Then you can clone RSD and prepare the docker images
```env
git clone https://github.com/research-software-directory/RSD-as-a-service.git
sudo make
```
You can then set your server name in nginx/nginx.conf, let's assume it is `fqdn.yourdomain.com`
```env
server_name fqdn.yourdomain.com;
```
Copy the example config to a .env file
```env
cp .env.example .env
```
and change, as described above, the values for `POSTGRES_PASSWORD`, `PGRST_JWT_SECRET` (with at least 32 characters) and `POSTGRES_AUTHENTICATOR_PASSWORD` to arbitrary values.
Additionally set 
```
POSTGREST_URL_EXTERNAL=http://fqdn.yourdomain.com/api/v1
RSD_AUTH_URL=http://fqdn.yourdomain.com:7000
RSD_ADMIN_EMAIL_LIST admin@example.com
```
This grants full admin access to a *local* user admin *without password*. Please note the @example.com "domain" is obligatory no matter what yourdomain is.
The way how admin users are managed will change soon, so please have a look how it works [in the future](https://research-software-directory.org/documentation/rsd-instance/getting-started/#log-in-as-rsd-administrator).

You can then prepare the SSL certificates for the user cookies

```env
cp .env frontend/.env.local
docker-compose exec nginx bash -c 'certbot --nginx -d fqdn.yourdomain.com --agree-tos --register-unsafely-without-email'
```
and create and start the final docker containers
```env
sudo make install
```

https://fqdn.yourdomain.com should now show your installation.  As mentioned you should now be able to log in with local user "admin".


