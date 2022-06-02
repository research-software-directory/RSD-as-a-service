# Contributing to the Research Software Directory (as a Service)

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to the Research Software Directory (as a Service), which is hosted on [GitHub](https://github.com/research-software-directory/RSD-as-a-service).
These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document.
We welcome any kind of contribution to our software, from simple comments or questions to a full fledged [pull request](https://help.github.com/articles/about-pull-requests/).

## Code of conduct

Help us keep the Research Software Directory open and inclusive. Please read and follow our [Code of Conduct](https://github.com/research-software-directory/RSD-as-a-service/blob/contributors/CODE_OF_CONDUCT.md).

## How to contribute

A contribution can be one of the following cases:
1. you have a question, suggestion, comment, etc.;
1. you have found a bug (including unexpected behavior, errors in documentation, etc.)
1. you want to request a feature;
1. you want to make some kind of change to the code base yourself (e.g. to fix a bug, to add a new feature, to update documentation).
1. you wish to contribute in some other way.

The sections below outline the steps in each case.

## You have a question, suggestion, comment, etc.

For general questions (not directly related to the development of the software) you can send an email to rsd@esciencecenter.nl. Alternatively, you can also submit an issue:

1. use the search functionality [here](https://github.com/research-software-directory/RSD-as-a-service/issues) to see if someone already filed the same issue;
1. if you find a similar issue, you can add your own comments to this issue;
1. if your issue search did not yield any relevant results, make a new issue;
1. apply the "question" label; apply other labels when relevant.

## You have found a bug

If you find a bug or experience unexpected behaviour, you can submit an issue:

1. use the search functionality [here](https://github.com/research-software-directory/RSD-as-a-service/issues) to see if someone already filed the same issue;
1. if you find a similar issue, you can add your own comments to this issue;
1. if your issue search did not yield any relevant results, make a new issue, making sure to provide enough information to the rest of the community to understand the cause and context of the problem. Depending on the issue and your technical expertise, you may want to include:
    - the [SHA hashcode](https://help.github.com/articles/autolinked-references-and-urls/#commit-shas) of the commit that is causing your problem;
    - some identifying information (name and version number) for the version you're using;
    - information about the operating system and browser you are using;
1. apply the "bug" label; apply other labels when relevant.

## You want to request a feature

To request a feature you can submit an issue on GitHub. Please keep in mind that our development resources are limited, so we may not be able to honor your request.

1. use the search functionality [here](https://github.com/research-software-directory/RSD-as-a-service/issues) to see if someone already filed the same issue;
1. if you find a similar issue, you can add your own comments and suggestions to this issue (having more people request the same feature may increase its priority);
1. if your issue search did not yield any relevant results, make a new issue, making sure to provide enough information to the rest of the community to understand the feature you are requesting. We may get back to you with further questions.
1. apply the "feature" label; apply other labels when relevant.

## You want to make some kind of change to the code base youself

Contributions to the code base are very welcome. Keep in mind, however, that this also requires a good interaction with the community to ensure that your contribution is adopted.

1. (**important**) announce your plan to the rest of the community _before you start working_. This announcement should be in the form of a (new) issue;
1. (**important**) wait until some kind of concensus is reached about your idea being a good idea;
1. (**important**) we are applying the [REUSE specification](https://reuse.software/) in order to keep track of authorships, copyright and licenses in this repository. Before commiting to your branch, consider using our [pre-commit hook template](#automatically-updating-headers-using-a-pre-commit-hook) that will help you adding the SDPX headers automatically upon each commit.
1. if needed, fork the repository to your own Github profile and create your own feature branch off of the latest master commit. While working on your feature branch, make sure to stay up to date with the master branch by pulling in changes, possibly from the 'upstream' repository (follow the instructions [here](https://help.github.com/articles/configuring-a-remote-for-a-fork/) and [here](https://help.github.com/articles/syncing-a-fork/));
1. make sure the existing unit tests still work;
1. make sure that the existing integration tests still work;
1. add your own unit tests and integration tests (if necessary);
1. update or expand the documentation;
1. [push](http://rogerdudler.github.io/git-guide/) your feature branch to (your fork of) the repository on GitHub;
1. create a pull request, e.g. following the instructions [here](https://help.github.com/articles/creating-a-pull-request/).

In case you feel like you've made a valuable contribution, but you don't know how to write or run tests for it, or how to generate the documentation: don't let this discourage you from making the pull request; we can help you! Just go ahead and submit the pull request, but keep in mind that you might be asked to append additional commits to your pull request (have a look at some of our old pull requests to see how this works.

## You want to contribute in some other way

Contributions to the code are by no means the only way to contribute to the Research Software Directory. If you wish to contribute in some other way, please contact us at rsd@esciencecenter.nl.

## Automatically updating headers using a pre-commit hook.

Git provides a way to automatically perform things using [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).
If you want to automatically add license and copyright headers, you may follow these instructions and set up a pre-commit hook on your local computer.
The script detects the file type and automatically assigns the correct license for this repository.

### Prerequisites

To be able to use this script, your need to have the [REUSE helper tool](https://reuse.readthedocs.io/en/stable/) installed and available in your path.

### Setting up the git hook

Create a new file called `pre-commit` in the directory `RSD-as-a-service/.git/hooks`. Make sure the file is executable by running

```bash
chmod +x pre-commit
```

Now, copy-paste this template and configure it as required:

```bash
#!/bin/sh
#
# SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
#
# SPDX-License-Identifier: Apache-2.0
#
# This is a script template for a pre-commit hook that will automatically
# add SPDX copyright and license headers using the REUSE tool.
# Please configure this file as required
#
# Configuration
# -------------
# Any of those variables is optional. The email is only used if an author is defined.
# If none of these variables is defined, only the license will be added.
AUTHOR=""
EMAIL=""
ORGANISATION=""
# End of configuration

# Please do not modify anything below

function check_program_exists () {
    if ! command -v $1 &> /dev/null; then
        echo "ERROR: $1 not found."
        exit 1
    fi
}

check_program_exists reuse
check_program_exists date

YEAR=$(date +"%Y")
AUTHOR_STRING=$AUTHOR
if [[ "$EMAIL" != "" ]]; then
    AUTHOR_STRING="${AUTHOR_STRING} <${EMAIL}>"
fi

BASE_ARGS="--year $YEAR --merge-copyrights"
if [[ $ORGANISATION != "" ]]; then
    BASE_ARGS="${BASE_ARGS} --copyright \"${ORGANISATION}\""
fi
if [[ $AUTHOR != "" ]]; then
    BASE_ARGS="${BASE_ARGS} --copyright \"${AUTHOR_STRING}\""
fi

OIFS=${IFS}
IFS=$'\n'
declare -a STAGED_FILES=( $(git diff --name-only --cached) )

for file in ${STAGED_FILES[@]}; do
    file_extension="${file##*.}"
    case ${file_extension} in
        md | webp | png | jpg | jpeg)
            LICENSE="CC-BY-4.0"
            ;;
        *)
            LICENSE="Apache-2.0"
            ;;
    esac
    ARGS="${BASE_ARGS} --license $LICENSE"
    eval "reuse addheader $ARGS $file 1> /tmp/reuse_out 2> /tmp/reuse_error"
    case $? in
        0)
            continue
            ;;
        2)
            echo "Could not recognise the file type of: ${file}. Aborting commit."
            echo "Error message:"
            cat /tmp/reuse_error
            exit 2
            ;;
        *)
            echo "An unhandled error code $? occurred:"
            cat /tmp/reuse_error
            exit 999
            ;;
    esac
done
```

Save the file and the pre-commit hook is in place.

### Using the pre-commit hook

To use the hook, work on your code and commit as usual. After committing, you will notice that the REUSE tool has automatically updated the headers.

### Skipping the pre-commit hook

If you do not want to run the pre-commit hook for a certain commit, use

```bash
git commit --no-verify
# or
git commit -n
```
