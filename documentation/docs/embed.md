<!--
SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->
# Embed an IFrame
## Embed the RSD Software and Projects as an IFrame

This feature allows you to embed the RSD Software and Projects as an IFrame in your website.
The Header and the Footer are automatically hidden and users will be able to navigate between the main list and the document.

### Use example:
Html test page: Test: https://www.research-software.dev/embed_example.html

### Embedding:
```html
<h2>Check our Software - Demo Embed pages</h2>
<iframe src="http://localhost/software?embed" title="RSD Software" width="100%" height="500" frameBorder="0"></iframe>

<h2>Check our Projects - Demo Embed pages</h2>
<iframe src="http://localhost/projects?embed" title="RSD Software" width="100%" height="500" frameBorder="0"></iframe>
```
