# Configuration

RSD offers following customization options:

- Authentication providers: in the environment file you can define authentication providers offered
- UI theme colors: in the settings.json you can customize UI look
- Feedback form: in the settings.json you can enable feedback form shown in the header
- Custom home page options: RSD offers three versions of the homepage: default rsd homepage, helmholtz and imperial
- Custom links: in the settings.json you can provide links to external pages. The links are shown in the footer of the RSD pages.

:::tip

- Main locations for customizing RSD are:
  - `.env` file at the same location as your docker-compose.yml
  - `settings.json` that should be (volume) mounted into the frontend service in your docker-compose.yml
- When configuring your production instance, replace `localhost` and `www.localhost` with the domain of your RSD

:::

## Authentication providers

The RSD supports the following third party OpenID Connect authentication services:

- [Microsoft Entra ID (Azure AD)](#enable-microsoft-entra-id-azure-ad-authentication)
- [ORCID](#enable-orcid-authentication-and-coupling)
- [SURFconext](#enable-surfconext-authentication)
- [Helmholtz AI](#enable-helmholtz-ai-authentication)

:::warning
RSD requires one of mentioned authentication providers to be used in the production. Please obtain the required information for setting up the authentication service directly from the provider. The required information about the authentication provider is stored in `.env` file (environment variables). After changing any value in the .env file you should restart the RSD instance.
:::

:::tip
You can define multiple providers for authentication in the environment variable by providing a semicolon seprated keys.
RSD_AUTH_PROVIDERS=AZURE;ORCID;HELMHOLTZID;SURFCONEXT;LOCAL
:::

### Enable Microsoft Entra ID (Azure AD) authentication

Please refer to [Microsoft Entra ID documention](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/add-application-portal-setup-oidc-sso) about setting up the application access. In the `.env` file you need to provide following information to enable the authentication service.

```bash
# Ensure AZURE key is included in the list
RSD_AUTH_PROVIDERS=AZURE

# AZURE ACTIVE DIRECTORY
# consumed by: authentication, frontend/utils/loginHelpers
AZURE_CLIENT_ID=
# consumed by: authentication, frontend/utils/loginHelpers
AZURE_REDIRECT=http://localhost/auth/login/azure
# consumed by: authentication, frontend/utils/loginHelpers
AZURE_WELL_KNOWN_URL=
# consumed by: authentication, frontend/utils/loginHelpers
AZURE_SCOPES=openid+email+profile
# consumed by: authentication, frontend/utils/loginHelpers
AZURE_LOGIN_PROMPT=select_account
# consumed by: frontend
# the name displayed to users when multiple providers are configured
AZURE_DISPLAY_NAME="Microsoft Azure AD"
# consumed by: frontend
# the description text displayed to users when multiple providers are configured
AZURE_DESCRIPTION_HTML="Sign in with your institutional credentials"
# consumed by: authentication
# the organisation recorded for users logged in via this provider
AZURE_ORGANISATION=
```

### Enable ORCID authentication and coupling

The RSD offers an integration with ORCID which can be used for login and coupling the user's RSD account with their ORCID. Both integrations can be used independently.

Please refer to the [ORCID OAuth documentation](https://info.orcid.org/documentation/integration-guide/getting-started-with-your-orcid-integration/) in order to set up the ORCID authentication service for the RSD. Specifically, look [here](https://info.orcid.org/documentation/integration-guide/registering-a-public-api-client/) on how to register redirect URLs.

For both integrations (login and coupling) these common variables need to be defined in `.env`:

```bash
# ORCID
# consumed by: authentication, frontend/utils/loginHelpers
ORCID_CLIENT_ID=
# consumed by: authentication, frontend/utils/loginHelpers
ORCID_WELL_KNOWN_URL=
# consumed by: authentication, frontend/utils/loginHelpers
ORCID_SCOPES=openid
# consumed by: frontend/utils/loginHelpers
ORCID_RESPONSE_MODE=query

# consumed by services: authentication
AUTH_ORCID_CLIENT_SECRET=
```

#### ORCID authentication

To enable login via ORCID, provide the following information in `.env`:

```bash
# Ensure ORCID key is included in the list
RSD_AUTH_PROVIDERS=ORCID

# consumed by: authentication, frontend/utils/loginHelpers
ORCID_REDIRECT=http://www.localhost/auth/login/orcid
```

:::warning
When using ORCID authentication only, each ORCID user need to be added to ORCID users list. See [ORCID users page](/rsd-instance/administration/#orcid-users) in the administration section.
:::

#### ORCID coupling

For ORCID account coupling to be enabled, the following variables need to be set in `.env`:

```bash
# consumed by: authentication, frontend/utils/loginHelpers
ORCID_REDIRECT_COUPLE=http://www.localhost/auth/couple/orcid
# Enable ORCID account coupling
RSD_AUTH_COUPLE_PROVIDERS=ORCID
```

If `RSD_AUTH_COUPLE_PROVIDERS` is undefined, ORCID account coupling is disabled.

:::danger
If ORCID login is disabled and ORCID coupling is enabled, users are added to the ORCID login allowlist after coupling their accounts.
:::

- For more [info about public profile page see documentation](/users/user-settings/#public-profile).
- If ORCID login is enabled: after a user links an ORCID to their RSD account they will be able to login using ORCID credentials too.

### Enable SURFconext authentication

Please refer to [SURFconext documention](https://www.surf.nl/en/surfconext-global-access-with-1-set-of-credentials).

:::danger
The main RSD instance is already registered with the SURFconext authentication service. We advise you to use our main RSD instance and enable it for your organisation. For more information see [register you organisation](/users/register-organisation/).
:::

### Enable Helmholtz AI authentication

Helmholtz already runs an RSD instance at [https://helmholtz.software/](https://helmholtz.software/)

## Host definitions

The `host` section of settings.json defines following settings. **Most of them should be customised**.

- `name`: default value is `rsd`. It is used to load default RSD homepage layout. The other two options are `helmholtz` and `imperial` which will load the homepage layout of these insitutions.
- `email`: the email shown in the footer of the RSD pages. It shoud be used as public contact email. **Change this value to reflect your contact email**.
- `emailHeaders`: append custom email headers when user tries to contact you.
- `logo_url`: the url to footer logo. You can change this value provided you also mount the image
- `website`: the url that will be attached to footer logo
- `feedback`: in the header of the RSD there is a feedback button. The feedback button can be enabled. In addition the `url` value is actually the email. In the form there is also link to RSD issues page if the user wants to create an Github issue concerning his/her feedback.
- `login_info_url`: the link to getting access documentation shown in the "Sign in with" modal. It is relevant only if you use more than one authentication provider. If you use only one authentication provider "Sign in with" modal is not used, instead the user is directly redirected to authentication page.
- `terms_of_service_url`: the link to your Terms of Service page. Used on the user profile page to let user accept the terms of service
- `privacy_statement_url`: the link to your privacy statement page. Used on the user profile page to let user accept the privacy statement.
- `software_highlights`: the definitions for the software highlights section on the top of the software overview page. You can specify title and the number of items loaded in the carousel. The default values are shown below.
- `modules`: defines RSD "modules" displayed in the main menu in the page header. Possible values are: software, projects, organisations and communities.

```json
...
"host": {
    "name": "rsd",
    "email": "rsd@esciencecenter.nl",
    "emailHeaders": [],
    "logo_url": "/images/logo-escience.svg",
    "website": "https://www.esciencecenter.nl",
    "feedback": {
      "enabled": true,
      "url": "rsd@esciencecenter.nl",
      "issues_page_url": "https://github.com/research-software-directory/RSD-as-a-service/issues"
    },
    "login_info_url":"https://research-software-directory.github.io/documentation/getting-access.html",
    "terms_of_service_url": "/page/terms-of-service/",
    "privacy_statement_url": "/page/privacy-statement/",
    "software_highlights": {
      "title": "Software Highlights",
      "limit": 5,
      "description": null
    },
    "modules":["software","projects","organisations"]
  }
...
```

:::tip host modules

- Note that the communities module is not included in the default settings definitions.
- Note that disabled module pages still can be accessed when "proper" url is used.
- You can enable it by adding "communities" into the modules array and the menu option will appear.
  :::

## UI theming

The look and feel of RSD can be customised with desired colors and fonts. In the settings.json the `theme` section defines all colors and fonts that can be customized. In addition, you can overwrite global styles (index.css), custom fonts and additional images.

:::tip

- The `settings.json` should be mounted into `/app/public/data` folder of frontend service
- The `index.css` should be mounted into `/app/public/styles` folder of frontend service
- When customizing RSD styles we advice to mount custom fonts in the styles folder close to index.css
- The footer logo should be mounted into `/app/public/images`. Then you can use relative image path `/images/your-logo.svg` in the settings.json
- Your [starting point should be our default files](https://github.com/research-software-directory/RSD-as-a-service/tree/main/frontend/public) where you adjust the values you want to be different.

:::

### Example mounting custom definitions

In this example we mount 3 local folders into the app/public location of the frontend service

```yml
  ...
  frontend:
  ...
    volumes:
      - ./deployment/rsd/styles:/app/public/styles
      - ./deployment/rsd/data:/app/public/data
      - ./deployment/rsd/images:/app/public/images
  ...
```

:::tip
If you have questions about customization please contact us on rsd@esciencecenter.nl
:::

### Light and dark theme mode in RSD

The light and dark theme colors in RSD case are not applicable to "common" theme change approach. The software and project pages use light and dark section on the page. In RSD case the dark theme is used in "dark" sections of the page.

## Default settings.json

RSD uses default settings.json if alternative is not mounted into `/app/public/data/settings.json` location of the frontend service.

```json
{
  "host": {
    "name": "rsd",
    "email": "rsd@esciencecenter.nl",
    "emailHeaders": [],
    "logo_url": "/images/logo-escience.svg",
    "website": "https://www.esciencecenter.nl",
    "feedback": {
      "enabled": true,
      "url": "rsd@esciencecenter.nl",
      "issues_page_url": "https://github.com/research-software-directory/RSD-as-a-service/issues"
    },
    "login_info_url": "https://research-software-directory.github.io/documentation/getting-access.html",
    "terms_of_service_url": "/page/terms-of-service/",
    "privacy_statement_url": "/page/privacy-statement/"
  },
  "links": [
    {
      "label": "Cookies",
      "url": "/cookies",
      "target": "_self"
    },
    {
      "label": "User Documentation",
      "url": "/documentation/category/users/",
      "target": "_blank"
    },
    {
      "label": "Technical Documentation",
      "url": "/documentation/category/developers/",
      "target": "_blank"
    },
    {
      "label": "Netherlands eScienceCenter",
      "url": "https://www.esciencecenter.nl/",
      "target": "_blank"
    }
  ],
  "theme": {
    "mode": "light",
    "light": {
      "colors": {
        "base-100": "#fff",
        "base-200": "#f5f5f7",
        "base-300": "#dcdcdc",
        "base-400": "#bdbdbd",
        "base-500": "#9e9e9e",
        "base-600": "#757575",
        "base-700": "#232323",
        "base-800": "#111",
        "base-900": "#000",
        "base-content": "rgba(34,36,37,1)",
        "base-content-secondary": "rgba(34,36,37,0.7)",
        "base-content-disabled": "rgba(34,36,37,0.45)",
        "primary": "#006649",
        "primary-content": "#fff",
        "secondary": "#000",
        "secondary-content": "#fff",
        "accent": "#01ad83",
        "accent-content": "#fff",
        "error": "#e53935",
        "error-content": "#fff",
        "warning": "#ed6c02",
        "warning-content": "#fff",
        "info": "#0288d1",
        "info-content": "#fff",
        "success": "#2e7d32",
        "success-content": "#fff",
        "glow-start": "#db2777",
        "glow-end": "#9333ea"
      },
      "action": {
        "active": "rgba(0, 0, 0, 0.54)",
        "hover": "rgba(0, 0, 0, 0.04)",
        "hoverOpacity": 0.04,
        "selected": "rgba(0, 0, 0, 0.08)",
        "selectedOpacity": 0.08,
        "disabled": "rgba(0, 0, 0, 0.26)",
        "disabledBackground": "rgba(0, 0, 0, 0.12)",
        "disabledOpacity": 0.38,
        "focus": "rgba(0, 0, 0, 0.12)",
        "focusOpacity": 0.12,
        "activatedOpacity": 0.12
      }
    },
    "dark": {
      "colors": {
        "base-100": "#0a0a0a",
        "base-200": "#151515",
        "base-300": "#2a2a2a",
        "base-400": "#757575",
        "base-500": "#9e9e9e",
        "base-600": "#bdbdbd",
        "base-700": "#dcdcdc",
        "base-800": "#eeeeee",
        "base-900": "#fff",
        "base-content": "rgba(255,255,255,0.87)",
        "base-content-secondary": "rgba(255,255,255,0.7)",
        "base-content-disabled": "rgba(255,255,255,0.45)",
        "primary": "#01ad83",
        "primary-content": "#fff",
        "secondary": "#000",
        "secondary-content": "#fff",
        "accent": "#73095d",
        "accent-content": "#fff",
        "error": "#e53935",
        "error-content": "#000",
        "warning": "#ed6c02",
        "warning-content": "#000",
        "info": "#0288d1",
        "info-content": "#000",
        "success": "#2e7d32",
        "success-content": "#fff",
        "glow-start": "#db2777",
        "glow-end": "#9333ea"
      },
      "action": {
        "active": "rgba(255, 255, 255, 0.54)",
        "hover": "rgba(255, 255, 255, 0.4)",
        "hoverOpacity": 0.1,
        "selected": "rgba(255, 255, 255, 0.08)",
        "selectedOpacity": 0.16,
        "disabled": "rgba(255, 255, 255, 0.26)",
        "disabledBackground": "rgba(255, 255, 255, 0.12)",
        "disabledOpacity": 0.38,
        "focus": "rgba(255, 255, 255, 0.12)",
        "focusOpacity": 0.12,
        "activatedOpacity": 0.12
      }
    },
    "typography": {
      "defaultFontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
      "titlesFontFamily": "'Work Sans', sans-serif",
      "fontWeightLight": 200,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500,
      "fontWeightBold": 600
    }
  }
}
```
