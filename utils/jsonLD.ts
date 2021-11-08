
export function breadcrumbList ({ id, name }:{id:string, name:string}) {
  return {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem',
      position: 1,
      item: {
        '@id': 'https://www.research-software.nl',
        name: 'Research Software Directory'
      }
    }, {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@id': 'https://www.research-software.nl/software',
        name: 'Software'
      }
    }, {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@id': `https://www.research-software.nl/software/${id}`,
        name
      }
    }]
  }
}

// Used in Legacy version
// It seems not to be recognized by Google validation tool
// https://search.google.com/test/rich-results/result?id=Y80kwY7VsEP6pdPCAvcyHw
// TODO: defined variables to be passed to this function
// now it's just returns one software example
export function softwareSourceCode () {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    author: [
      {
        '@id': 'https://orcid.org/0000-0003-0182-9008',
        '@type': 'Person',
        affiliation: {
          '@type': 'Organization',
          legalName: 'Netherlands eScience Center'
        },
        familyName: 'van Hees',
        givenName: 'Vincent'
      },
      {
        '@type': 'Person',
        affiliation: {
          '@type': 'Organization',
          legalName: 'Activinsights Ltd.'
        },
        familyName: 'Fang',
        givenName: 'Zhou'
      },
      {
        '@id': 'https://orcid.org/0000-0003-1474-1734',
        '@type': 'Person',
        affiliation: {
          '@type': 'Organization',
          legalName: 'University of Leicester'
        },
        familyName: 'Mirkes',
        givenName: 'Evgeny'
      },
      {
        '@type': 'Person',
        affiliation: {
          '@type': 'Organization',
          legalName: 'University College London'
        },
        familyName: 'Heywood',
        givenName: 'Joe'
      },
      {
        '@id': 'https://orcid.org/0000-0003-4930-3582',
        '@type': 'Person',
        affiliation: {
          '@type': 'Organization',
          legalName: 'MRC Epidemiology Unit'
        },
        familyName: 'Zhao',
        givenName: 'Jing Hua'
      },
      {
        '@type': 'Person',
        affiliation: {
          '@type': 'Organization',
          legalName: 'Polytechnical University of Catalonia'
        },
        familyName: 'Joan',
        givenName: 'Capdevila Pujol'
      },
      {
        '@id': 'https://orcid.org/0000-0003-3109-9720',
        '@type': 'Person',
        affiliation: {
          '@type': 'Organization',
          legalName: 'Inserm'
        },
        familyName: 'Sabia',
        givenName: 'Séverine'
      },
      {
        '@id': 'https://orcid.org/0000-0003-0366-6935',
        '@type': 'Person',
        affiliation: {
          '@type': 'Organization',
          legalName: 'University of Granada'
        },
        familyName: 'Migueles',
        givenName: 'Jairo H.'
      }
    ],
    codeRepository: 'https://github.com/wadpac/GGIR',
    datePublished: '2020-06-04',
    identifier: 'https://doi.org/10.5281/zenodo.3877165',
    keywords: [
      'activity tracker',
      'health',
      'fitness',
      'sleep research',
      'accelerometer'
    ],
    license: 'http://www.gnu.org/licenses/old-licenses/lgpl-2.0-standalone.html',
    name: 'GGIR',
    version: 'v2.0-1'
  }
}
