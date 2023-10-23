# Data scrapers

RSD uses data scraper services to obtain and update various information. In this chapter we explain these services.
The scraper services are scheduled to run every 10 minutes on average. These services scrape the data from using various open API's which might have limit on the amount of data that can be scraped.

:::warning
The scraper services can only scrape information that is publicaly available.
:::

## Programming languages

The service scrapes the information about used programming languages from Github or Gitlab repository. The schedule runs every 6 minutes with and scraping the batch of 10 items. This scraper needs to take into a count the Github and Gitlab api daily limit of allowed API requests.

:::warning
This service only scrapes information of public repositories. Currently it is not possible to scrape information from private repositories.
:::

## Commit history

The service scrapes the information about used programming languages from Github or Gitlab repository.

:::warning
This service only scrapes information of public repositories. Currently it is not possible to scrape information from private repositories.
:::

## Contributors

!TODO provide information about contributor scraper service

## Software releases

The service scrapes information from Zenodo about registered software releases based on Concept DOI.

## Citations

This service uses DataCite, Crossref and OpenAlext API's to obtain information about the citations and publications.

## Package managers

This service obtains information from supported packages managers about the number of downloads.
