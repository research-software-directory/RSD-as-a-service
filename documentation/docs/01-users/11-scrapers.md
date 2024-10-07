# Data scrapers

The RSD uses data scraper services to obtain and update various data. In this chapter, we explain these services.
The scraper services are scheduled to run every 6 minutes on average. These services scrape the data from using various open APIs, which might have a limit on the amount of data that can be scraped.

:::warning
The scraper services can only scrape information that is publicly available.
:::

## Programming languages

The service scrapes information about used programming languages from GitHub or GitLab repositories. They are scheduled every 6 minutes and scrape a batch of 25 repositories each time (taking into account the GitHub and GitLab API rate limits).

:::warning
This service only scrapes information of public repositories. Currently, it is not possible to scrape information from private repositories.
:::

## Commit history

The service scrapes the commit history from your GitHub or GitLab repository, in order to show the activity graph on the page.

:::warning
This service only scrapes information of public repositories. Currently, it is not possible to scrape information from private repositories.
:::

## Contributors

This service scrapes the contributor count from the repository of your software. We currently don't use this value.

## Software releases

This service collects and stores all releases of your software page, if your software has a *[Concept DOI](https://support.zenodo.org/help/en-gb/1-upload-deposit/97-what-is-doi-versioning)*. The result is shown on the publicly facing software page as the "Cite this software" block.

The releases are harvested from the [DataCite API](https://support.datacite.org/docs/api). We use the supplied concept DOI of the software to see if any *versions* exist of this software in the DataCite database. The best way to ensure that these links are stored in the DataCite database is to make use of the [GitHub and Zenodo integration](https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content). This will make sure that every time you create a release of your software, an entry is created in [Zenodo](https://zenodo.org/) and that the link between the release and the concept DOI is created in the DataCite database.

## Citations

This service uses the APIs of DataCite, Crossref and OpenAlex to obtain information about citations of reference papers you have supplied.

## Package managers

This service obtains information from supported packages managers about the number of dependents on the software and the number of downloads. Currently, we can only scrape download counts from Docker Hub. If you know reliable sources for other package managers, please let us know!
