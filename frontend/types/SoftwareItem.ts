// based on one record taken from legacy RSD
const softwareItem={
  "primaryKey": {
      "id": "3d-e-chem-knime-kripodb",
      "collection": "software"
  },
  "createdAt": "2017-11-14T13:37:17Z",
  "updatedAt": "2019-01-31T08:28:20Z",
  "brandName": "KNIME node for Kripo",
  "bullets": "* For cheminformaticans who want to do structure-based protein binding site comparison and bioisosteric replacement for ligand design\n* It makes the Kripo Python library available in the KNIME workflow platform as workflow nodes.\n* Kripo encodes the interactions of protein and bound ligand also known as a pharmacophore into a fingerprint, the fingerprints can be compared to each other to find similar pharmacophores\n* The Kripo software is open source while most other similar software is commercial or requires registration",
  "conceptDOI": "10.5281/zenodo.597262",
  "contributors": [
      {
          "foreignKey": {
              "collection": "person",
              "id": "s.verhoeven"
          },
          "isContactPerson": true,
          "affiliations": [
              {
                  "foreignKey": {
                      "collection": "organization",
                      "id": "nlesc"
                  }
              }
          ]
      }
  ],
  "getStartedURL": "https://www.knime.com/3d-e-chem-nodes-for-knime",
  "repositoryURLs": {
      "github": [
          "https://github.com/3D-e-Chem/knime-kripodb"
      ]
  },
  "isFeatured": false,
  "isPublished": true,
  "license": [
      "GPL-3.0"
  ],
  "programmingLanguage": [
      "Java",
      "Python"
  ],
  "readMore": null,
  "shortStatement": "A node for the KNIME workflow systems that allows you to compare different binding sites in proteins with each other.",
  "slug": "knime-kripodb",
  "tags": [
      "Workflow technologies"
  ],
  "testimonials": [],
  "related": {
      "software": [],
      "mentions": [
          {
              "foreignKey": {
                  "id": "BBEY84IC",
                  "collection": "mention"
              }
          },
          {
              "foreignKey": {
                  "id": "SJRUXGD3",
                  "collection": "mention"
              }
          }
      ],
      "projects": [
          {
              "foreignKey": {
                  "id": "1091",
                  "collection": "project"
              }
          }
      ],
      "organizations": [
          {
              "foreignKey": {
                  "id": "nlesc",
                  "collection": "organization"
              }
          },
          {
              "foreignKey": {
                  "id": "vua",
                  "collection": "organization"
              }
          },
          {
              "foreignKey": {
                  "id": "radboud.university.nijmegen",
                  "collection": "organization"
              }
          }
      ]
  },
  "createdBy": "Unknown",
  "updatedBy": "sverhoeven"
} 

const rsdSoftwareItem = {
    "id": "b2d2b41d-a387-4a2f-ae4b-8bda13f323e7",
    "slug": "3d-e-chem-knime-pharmacophore",
    "brand_name": "KNIME Pharmacophore",
    "bullets": "* For cheminformations who are working with pharmacphores in KNIME workflows.\n* Adds pharmacophore data type to KNIME\n* Adds nodes to read, write and align pharmacophores\n",
    "get_started_url": "https://github.com/3D-e-Chem/knime-pharmacophore",
    "is_featured": false,
    "is_published": true,
    "read_more": "A pharmacophore is an abstract description of molecular features that are necessary for molecular recognition of a ligand by a biological macromolecule. This plugin for the KNIME workflow system adds the Pharmacophore (Phar) data type to KNIME, and adds nodes to read, write, and manipulate pharmacophores inside KNIME. It includes the [KNIME Silicos-it](https://www.research-software.nl/software/3d-e-chem-knime-silicos-it), [Kripo pharmacophore retrieval](https://www.research-software.nl/software/3d-e-chem-knime-kripodb) and [molviewer pharmacophore viewer](https://www.research-software.nl/software/knime-molviewer) nodes. \n\n\n",
    "short_statement": "A plugin for the KNIME workflow system that adds a Pharmacophore data type and nodes to read, write, and align them.",
    "created_at": "2021-12-09T15:25:13.254331",
    "updated_at": "2021-12-09T15:25:13.254331"
}


export type SoftwareItem = typeof rsdSoftwareItem
