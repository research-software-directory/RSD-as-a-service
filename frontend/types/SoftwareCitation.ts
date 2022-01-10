// based on rsd db extract
// const rsdCitationItemContent=[{
//   'id': '176988a3-28d0-4cac-b657-8a9a506c8e69',
//   'release_id': 'e89b2d3d-7efc-44f3-810d-3a09a83de209',
//   'citability': 'full',
//   'date_published': '2020-10-21',
//   'doi': '10.5281/zenodo.4116521',
//   'tag': '0.2.0',
//   'url': 'https://github.com/NLeSC/spot/tree/0.2.0',
//   'bibtex': '@misc{YourReferenceHere,\nauthor = {\n            Jisk Attema and\n            Faruk Diblen\n         },\ntitle  = {spot},\nmonth  = {10},\nyear   = {2020},\ndoi    = {10.5281/zenodo.4116521},\nurl    = {https://github.com/NLeSC/spot}\n}\n',
//   'cff': 'authors:\n- affiliation: Netherlands eScience Center\n  family-names: Attema\n  given-names: Jisk\n- affiliation: Netherlands eScience Center\n  family-names: Diblen\n  given-names: Faruk\n  orcid: https://orcid.org/0000-0002-0989-929X\ncff-version: 1.0.3\ndate-released: 2020-10-21\ndoi: 10.5281/zenodo.4116521\nkeywords:\n- visualization\n- big data\n- visual data analytics\n- multi-dimensional data\nlicense: Apache-2.0\nmessage: If you use this software, please cite it using these metadata.\nrepository-code: https://github.com/NLeSC/spot\ntitle: spot\nversion: 0.2.0\n',
//   'codemeta': '{\n    "@context": [\n        "https://doi.org/10.5063/schema/codemeta-2.0",\n        "http://schema.org"\n    ],\n    "@type": "SoftwareSourceCode",\n    "author": [\n        {\n            "@type": "Person",\n            "affiliation": {\n                "@type": "Organization",\n                "legalName": "Netherlands eScience Center"\n            },\n            "familyName": "Attema",\n            "givenName": "Jisk"\n        },\n        {\n            "@id": "https://orcid.org/0000-0002-0989-929X",\n            "@type": "Person",\n            "affiliation": {\n                "@type": "Organization",\n                "legalName": "Netherlands eScience Center"\n            },\n            "familyName": "Diblen",\n            "givenName": "Faruk"\n        }\n    ],\n    "codeRepository": "https://github.com/NLeSC/spot",\n    "datePublished": "2020-10-21",\n    "identifier": "https://doi.org/10.5281/zenodo.4116521",\n    "keywords": [\n        "visualization",\n        "big data",\n        "visual data analytics",\n        "multi-dimensional data"\n    ],\n    "license": "http://www.apache.org/licenses/LICENSE-2.0",\n    "name": "spot",\n    "version": "0.2.0"\n}',
//   'endnote': '%0\n%0 Generic\n%A Attema, Jisk & Diblen, Faruk\n%D 2020\n%T spot\n%E\n%B\n%C\n%I GitHub repository\n%V\n%6\n%N\n%P\n%&\n%Y\n%S\n%7\n%8 10\n%9\n%?\n%!\n%Z\n%@\n%(\n%)\n%*\n%L\n%M\n\n\n%2\n%3\n%4\n%#\n%$\n%F YourReferenceHere\n%K "visualization", "big data", "visual data analytics", "multi-dimensional data"\n%X\n%Z\n%U https://github.com/NLeSC/spot\n',
//   'ris': 'TY  - COMP\nAU  - Attema, Jisk\nAU  - Diblen, Faruk\nDO  - 10.5281/zenodo.4116521\nKW  - visualization\nKW  - big data\nKW  - visual data analytics\nKW  - multi-dimensional data\nM3  - software\nPB  - GitHub Inc.\nPP  - San Francisco, USA\nPY  - 2020/10/21\nT1  - spot\nUR  - https://github.com/NLeSC/spot\nER  -\n',
//   'schema_dot_org': '{\n    "@context": "https://schema.org",\n    "@type": "SoftwareSourceCode",\n    "author": [\n        {\n            "@type": "Person",\n            "affiliation": {\n                "@type": "Organization",\n                "legalName": "Netherlands eScience Center"\n            },\n            "familyName": "Attema",\n            "givenName": "Jisk"\n        },\n        {\n            "@id": "https://orcid.org/0000-0002-0989-929X",\n            "@type": "Person",\n            "affiliation": {\n                "@type": "Organization",\n                "legalName": "Netherlands eScience Center"\n            },\n            "familyName": "Diblen",\n            "givenName": "Faruk"\n        }\n    ],\n    "codeRepository": "https://github.com/NLeSC/spot",\n    "datePublished": "2020-10-21",\n    "identifier": "https://doi.org/10.5281/zenodo.4116521",\n    "keywords": [\n        "visualization",\n        "big data",\n        "visual data analytics",\n        "multi-dimensional data"\n    ],\n    "license": "http://www.apache.org/licenses/LICENSE-2.0",\n    "name": "spot",\n    "version": "0.2.0"\n}'
// }]
// const rsdCitationItem = {
//   'id': 'e89b2d3d-7efc-44f3-810d-3a09a83de209',
//   'software': '03e46e16-fa53-4cb6-996d-4e8204c7c5af',
//   'is_citable': true,
//   'latest_schema_dot_org': '{\n    "@context": "https://schema.org",\n    "@type": "SoftwareSourceCode",\n    "author": [\n        {\n            "@type": "Person",\n            "affiliation": {\n                "@type": "Organization",\n                "legalName": "Netherlands eScience Center"\n            },\n            "familyName": "Attema",\n            "givenName": "Jisk"\n        },\n        {\n            "@id": "https://orcid.org/0000-0002-0989-929X",\n            "@type": "Person",\n            "affiliation": {\n                "@type": "Organization",\n                "legalName": "Netherlands eScience Center"\n            },\n            "familyName": "Diblen",\n            "givenName": "Faruk"\n        }\n    ],\n    "codeRepository": "https://github.com/NLeSC/spot",\n    "datePublished": "2020-10-21",\n    "identifier": "https://doi.org/10.5281/zenodo.4116521",\n    "keywords": [\n        "visualization",\n        "big data",\n        "visual data analytics",\n        "multi-dimensional data"\n    ],\n    "license": "http://www.apache.org/licenses/LICENSE-2.0",\n    "name": "spot",\n    "version": "0.2.0"\n}',
//   'created_at': '2021-12-21T11:52:11.15736',
//   'updated_at': '2021-12-21T11:52:11.15736',
//   'release_content': rsdCitationItemContent
// }

export type SoftwareCitationContent = {
  id: string;
  release_id: string;
  citability: 'full'|'doi';
  date_published: string;
  doi: string;
  tag: string;
  url: string;
  bibtex: string;
  cff: string;
  codemeta: string;
  endnote: string;
  ris: string;
  schema_dot_org: string;
}

export type SoftwareCitationInfo = {
  id: string;
  software: string;
  is_citable: boolean;
  latest_schema_dot_org: string;
  created_at: string;
  updated_at: string;
  release_content: SoftwareCitationContent[]
}

