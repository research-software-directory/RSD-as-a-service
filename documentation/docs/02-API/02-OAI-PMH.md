# OAI-PMH

We use the [jOAI project](https://github.com/NCAR/joai-project) as an OAI-PMH server that [OpenAIRE](https://explore.openaire.eu/) can scrape.

We provide XML files in the `oai_datacite` metadata format in order for jOAI to work.

We've developed a small Java program that scrapes the RSD API for releases of software, scrapes the [DataCite OAI server](https://oai.datacite.org/oai/) for its metadata and saves the metadata as XML files.
