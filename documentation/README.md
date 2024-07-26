<!--
SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)

SPDX-License-Identifier: CC-BY-4.0
-->

# RSD documentation

This documentation uses [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
# from the documentation folder
npm install
```

### Local Development

From the documentation folder run one of

```bash
# starts Docusaurus on http://localhost:3000/documentation/ and opens a new tab in browser
npm start
# start Docusaurus on http://localhost:3000/documentation/ but doesn't open itself in the browser
npm run dev
```

These commands both start a local development server on port 3000. Most changes are reflected live without having to restart the server. Warnings will be shown in case that links to internal pages or image links are incorrect.

### Build

The documentation is integrated in the RSD docker-compose file. Examine the output for any warnings or errors during the build. Warnings will be shown in case that links to internal pages or image links are incorrect.

```bash
# build documentation app
docker compose build documentation
```

## How to add new content?

Docusaurus has a lot of features. Concerning the content, it supports simple Markdown files (`/*.md`), Markdown with React components (`/*.mdx`) and complete react pages (stored in `src/pages` folder). We **mainly use simple Markdown pages `(*.md)`**. We only use Markdown with React as the index page of each documentation section (`index.mdx`). The `index.mdx` enables us to combine Markdown content with the Docusaurus component which lists all section pages.

### Folders / sections

To create a new documentation section you create new folder under the `docs`. To define section label and the position in the menu use following approach:

- Include the menu position in the folder name, for example `01-first-menu-option`
- Create an `index.mdx` file at the root with following content:
  - import Docusaurus component to list all section pages (line 1)
  - define the menu and page title (line 3)
  - add section introduction text to be shown before section table of content (line 5)
  - use imported Docusaurus component to load section table of content (line 7)
  - optionally add more text under the card list component (line 9)

Example `index.mdx`

```mdx
import DocCardList from '@theme/DocCardList'

# Section title in the menu

Add any text to this page before or after Docusaurus list component

<DocCardList />

You can add the text after the component too.
```

**You can copy an `index.mdx` file from one of the already existing folders.**

Using `index.mdx`, each section will have a start page with a list of all (child) pages as simple "cards". The cards use the page title as the title and the first line of the Markdown content as short description. If you want the card to use a custom description, you will need to use frontmatter header. Currently, we prefer to use a simple approach by using title and first line of the content.

### File naming convention

The content is stored in the `docs` folder as simple Markdown files. Each Markdown file should have accompanying license file (`*.md.license`). The file name should start with a number indicating the page position in the menu displayed on the left side.

Example from the `docs/01-users` folder:

- `01-navigation.md`: page content file in Markdown format, indicating page to be first menu entry
- `01-navigation.md.license`: license file. We need to use separate license file because we decided to keep first line of the Markdown file for the title or frontmatter definitions (if these are needed later).

### Page title / menu label

Defining the page title and short description can be done in two ways:

- The title of the page is in the Markdown file using `#` just as in any Markdown file. This is the preferred approach.

```Markdown
# Used as page title and menu label

The content of Markdown file.
```

- The title is defined in the header of the Markdown file using the frontmatter. Use this approach only when the first approach is not possible. Please note that the frontmatter definition need to be at the first line of the Markdown file.

```frontmatter
---
title: Introduction
description: This is a short description
sidebar_position: 1
sidebar_label: Introduction
---

The content of Markdown file

```

### Using images

**We would like to co-locate used images with the documentation sections**. For example the images used in the `Users` section are in the `users/img` folder.

In the example below the `img` folder is at the same location as the Markdown file. During the compilation, these images are collected and moved to assets folder and the link is automatically adjusted. For implementation see `/docs/users/01-navigation.md` file

```markdown
![image](img/idp-selection.gif)
```

### Custom colours for classic theme

We use the `classic` Docusaurus template. We can overwrite the theme colours using css variables. The colours are defined in the CSS file at `documentation/src/css/custom.css`.

For more information about the theme and styling see [official Docusaurus documentation](https://docusaurus.io/docs/3.0.0-rc.0/styling-layout#styling-your-site-with-infima).

You can view all css variables using the debugging tool in your browser and checking CSS section of it.

### Local search

We use `docusaurus-lunr-search` plugin for local search. **Note! The search does not work in development mode. This is by design.** The local search plugin will created search index during the build. The search can be tested only in the build version.

## Docusaurus setup

### Configuration

The Docusaurus configuration is stored in the `docusaurus.config.js` file. More information is [available in the documentation](https://docusaurus.io/docs/3.0.0-rc.0/configuration).

### Documentation

The official documentation is available at [https://docusaurus.io/](https://docusaurus.io/)
