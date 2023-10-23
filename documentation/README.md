<!--
SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
SPDX-FileCopyrightText: 2023 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# RSD documentation

This documentation uses [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

## Installation

Currently we need to use --legacy-peer-deps during the installation in order to force the installation of docusaurus-lunr-search which does not have (yet) docusaurus v3 version defined in it's peer dependencies.

```bash
# from the documentation folder
npm install --legacy-peer-deps
```

### Local Development

From the documentation folder run

```bash
# starts docusaurus on http://localhost:3000/documentation/ in and opens new tab in browser
npm start
# start docusaurus on http://localhost:3000/documentation/
npm run dev
```

This command starts a local development server on port 3000 and opens up a browser window. Most changes are reflected live without having to restart the server. The warnings will be shown in case that links to internal pages or image links are incorrect.

### Build

The documentation is intergrated in the RSD docker-compose file. During the build examine the output for any warnings or errors. The warnings will be shown in case that links to internal pages or image links are incorrect.

```bash
# build documentation app
docker compose build documentation
```

## How to add new content?

Docusaurus has lot of features. Concerning the content it supports simple markdown files (\*.md), markdown with React components (\*.mdx) and complete react pages (stored in src\pages folder). We **mainly use simple markdown pages (*.md)**. We only use markdown with React as index page of each documentation section (index.mdx). The index.mdx enables us to combine markdown content with the docusaurus component which lists all section pages.

### Folders/sections

To create a new documentation section you create new folder under the `docs`. To define section label and the position in the menu use following approach:

- Include menu position in the folder name, for example `01-first-menu-option`
- Create index.mdx file at the root with following content:
  - import docusaurus component to list all section pages (line 1)
  - define the menu and page title (line 3)
  - add section introduction text to be shown before section table of content (line 5)
  - use imported docusaurus component to load section table of content (line 7)
  - optionally add more text under the card list component (line 9)

Example index.mdx

```mdx
import DocCardList from '@theme/DocCardList'

# Section title in the menu

Add any text to this page before or after docusaurus list component

<DocCardList />

You can add the text after the component too.
```

**You can copy index.mdx file from one of already existing folders.**

Using `index.mdx` each section will have an start page with a list of all (child) pages as simple "cards". The cards use page title as the title and the first line of the markdown content as short description. If you want the card to use custom description you will need to use frontmatter header. Currently we prefer to use simple approach by using title and first line of the content.

### File naming convention

The content is stored in the `docs` folder as simple markdown files. Each markdown file should have accompaning license file (*.md.license). The file name should start with a number indicating page position in the menu displayed on the left side.

Example from the `docs\01-users` folder:

- `01-navigation.md`: page content file in markdown format, indicating page to be first menu entry
- `01-navigation.md.license`: license file. We need to use separate license file because we decided to keep first line of the markdown file for the title or frontmatter definitions (if these are needed later).


### Page title / Menu label

Defining the page title and short description can be done in two ways:

- The title of the page is in the markdown file using `#` just as in any markdown file. This is the prefered approach.

```Markdown
# Used as page title and menu label

The content of markdown file.
```

- The title is defined in the header of the markdown file using the frontmatter. Use this approach only when perfered approach is not possible. Please note that the frontmatter definition need to be at the first line of markdown file.

```frontmatter
---
title: Introduction
description: This is short description
sidebar_position: 1
sidebar_label: Introduction
---

The content of markdown file

```

### Using images

**We would like to colocate used images with the documentation sections**. For example the images used in the `Users` section are in the `users\img` folder.

In the example below the img folder is at the same location as markdown file. During the compilation these images are collected and moved to assets folder and the link is automatically adjusted. For implementation see `\docs\users\01-navigation.md` file

```markdown
![image](img/idp-selection.gif)
```

### Custom colors for classic theme

We use `classic` docusaurus template. We can overwrite the theme colors using css variables. The colors are defined in the css file at `documentation\src\css\custom.css`.

For more information about the theme and styling see [official docusaurus documentation](https://docusaurus.io/docs/3.0.0-rc.0/styling-layout#styling-your-site-with-infima).

You can view all css variables using the debuging tool inyour browser and checking css section of it.

### Local search

We use `docusaurus-lunr-search` plugin for local search. **Note! The search does not work in development mode. This is by design.** The local search plugin will created search index during the build. The search can be tested only in the build version.

## Docusaurus setup

### Configuration

The docusaurus configuration is stored in `docusaurus.config.js` file. More information is [avaliable in the documenation](https://docusaurus.io/docs/3.0.0-rc.0/configuration).

### Documentation

The official documentation is available at [https://docusaurus.io/](https://docusaurus.io/)
