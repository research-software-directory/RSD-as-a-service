# Configuration

RSD offers following customization options:

- Authentication providers: in the environment file you can define authentication providers offered
- UI theme colors: in the settings.json you can customize UI look
- Feedback form: in the settings.json you can enable feedback form shown in the header
- Custom home page options: RSD offers three versions of the homepage: default rsd homepage, helmholtz and imperial
- Custom footer links: in the settings.json you can provide custom

## Authentication providers

RSD supports the following third party OpenID Connect authentication services:

- [Microsoft Entra ID (Azure AD)](#enable-microsoft-entra-id-azure-ad-authentication)
- [ORCID](#enable-orcid-authentication)
- [SURFconext](#enable-surfconext-authentication)
- [Helmholtz AI](#enable-helmholtz-ai-authentication)

:::warning
RSD requires one of mentioned authentication providers to be used in the production. Please obtain the required information for setting up the authentication service directly from the provider. The required information about the authentication provider is stored in `.env` file (environment variables). After changing any value in the .env file you should restart the RSD instance.
:::

:::tip
You can define multiple providers for authentication in the environment variable by providing a semicolon seprated keys.
RSD_AUTH_PROVIDERS=AZURE;ORCID;HELMHOLTZAAI;SURFCONEXT;LOCAL
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

### Enable ORCID authentication

Please refer to [ORCID OAuth documentation](https://info.orcid.org/documentation/integration-guide/getting-started-with-your-orcid-integration/) in order to setup ORCID authentication service for RSD.

In the RSD `.env` file you need to provide following information to enable this authenitcation service.

```bash
# Ensure ORCID key is included in the list
RSD_AUTH_PROVIDERS=ORCID

# ORCID
# consumed by: authentication, frontend/utils/loginHelpers
ORCID_CLIENT_ID=
# consumed by: authentication, frontend/utils/loginHelpers
ORCID_REDIRECT=http://localhost/auth/login/orcid
# consumed by: authentication, frontend/utils/loginHelpers
ORCID_WELL_KNOWN_URL=
# consumed by: authentication, frontend/utils/loginHelpers
ORCID_SCOPES=openid
# consumed by: frontend/utils/loginHelpers
ORCID_RESPONSE_MODE=query

```

:::warning
In addition to defining ORCID as authentication provider each ORCID user need to be added to ORCID users list. See [ORCID users page](/rsd-instance/administration/) in the administration section.
:::

### Enable SURFconext authentication

Please refer to [SURFconext documention](https://www.surf.nl/en/surfconext-global-access-with-1-set-of-credentials).

:::danger
The main RSD instance is already registered with the SURFconext authentication service. We advise you to use our main RSD instance and enable it for your organisation. For more information see [register you organisation](/users/register-organisation/).
:::

### Enable Helmholtz AI authentication

Helmholtz already runs an RSD instance at [https://helmholtz.software/](https://helmholtz.software/)

## UI theming

The look and feel of RSD can be customised to use desired colors and fonts. In the settings.json the `theme` section defines all properties that can be customized.

## Feedback form

In the header of the RSD there is a feedback button. The feedback button can be enabled in settings.json

Feedback property section in the settings.json

```json
...
{
  "feedback": {
    "enabled": true,
    "url": "https://feedback.example.com",
    "issues_page_url": ""
  }
}
...
```

## Custom homepage

The RSD homepage type is defined in settings.json

## Default settings.json

RSD uses default settings.json if alternative is not mounted into a Docker image of the frontend service container.

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
    "login_info_url":"https://research-software-directory.github.io/documentation/getting-access.html",
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
