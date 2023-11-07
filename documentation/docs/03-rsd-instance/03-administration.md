# Administration

The administration of RSD instance.

## Public pages

Here you can define custom public pages for you RSD instance. The links are shown in the footer of the RSD.

![image](img/admin-public-pages.webp)

- The title is used as link label
- The slug is used as link
- The content of the page is in Markdown

## Software highlights

The software overview page design has a highlights section. This section is shown when the software highlights are defined by RSD admin.

![image](img/admin-software-highlights.webp)

:::tip
You can customise the software highlights section title in `settings.json` by providing a value for the optional property `software_highlights_title`.
:::

## ORCID users

In this section contains the allowlist of ORCIDs allowed to log in to the RSD.

:::warning
In order to use this functionality, the [ORCID authentication provider need to be enabled](/rsd-instance/configurations/#enable-orcid-authentication).
:::
