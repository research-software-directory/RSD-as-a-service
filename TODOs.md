
TODOs for category feature
==========================

- add backend test? how?
- sort results of backend functions which return list of category path
- how should we abbreviate some of these long category names?
- the API calling functions have a lot of copy&paste code. Let's create some generic helper functions for API calls
- eval use of WITH RECURSIVE..SEARCH for category_path()

DB tests
========

- unique category short_name, name for top level and for sub-level categories
- prevent cycles in categories. single + multi statements
- update category id

FE tests
========

- ?


More ideas for later
====================

- assign a category to a software: add a search field