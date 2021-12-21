// based on one record taken from legacy RSD
const project = {
  'title': '3D Geospatial Data Exploration for Modern Risk Management Systems',
  'subtitle': 'The country below sea level',
  'image': {
    'data': 'base64-eoncoded-image',
    'mimeType': 'image/jpeg'
  },
  'primaryKey': {
    'collection': 'project',
    'id': '1213'
  },
  'output': [],
  'impact': [],
  'createdAt': '2020-04-21T17:04:07Z',
  'updatedAt': '2021-11-16T12:32:01Z',
  'createdBy': 'Scraper',
  'updatedBy': 'bakhshir',
  'callUrl': 'https://doi.org/FIXME',
  'codeUrl': 'https://github.com/FIXME',
  'dateEnd': '2016-09-30',
  'dateStart': '2015-10-01',
  'description': '55% of The Netherlands is below sea level. This area contains 60% of the population and generates 65% of the Gross National Product. Obviously, The Netherlands requires efficient risk and water management.\n\nEfficient risk assessment requires large-scale flood simulations with high precision in case a dike or dam breaks. Continuous monitoring of man-made infrastructures in search of small deviations or breaches. And impact assessment of urban area re-organization.\n\nFor precise and effective risk assessment, we must increase precision in high-resolution flood simulations, improve accuracy of semantic trajectory determination of water channel networks, and provide the means to align and compare data sets at different resolutions to study the spatial evolution over time of an area or structure.\n\nUnfortunately, current solutions, consisting of PostGIS combined with stand-alone applications and libraries, lack the necessary flexibility and scalability and require extensive preprocessing of the data. The goal of this project is to modernize generation and manipulation of these datasets by using a Geospatial Database Management System (DBMS). The unique advantage of this approach is that, unlike previous solutions, it stores the raw data sets, and transforms, combines and processes them only when needed. This will vastly improve flexibility and performance.\n\nTo achieve this goal the project team will extend a Geospatial Database Management System (G-DBMS) with a flexible storage schema for 2D/3D geospatial datasets (point cloud, raster, vector, etc.). This is used to store semantically rich objects needed for the personalization of 3D digital city models (i.e., data re-generation with user defined parameters). These 3D digital city models form the basis for flow simulations, urban planning and under- and over- ground formation analysis. Additionally they are very important for automated anomaly detection on manmade structures.\n\nIn this G-DBMS, topological and geometric functionality for 3D raster manipulation will become first-class citizens. For near real-time 3D model generation and manipulation some of these operators will be complemented with a GPU version. Application specific functionality, such as constrained Delaunay triangulation and the marching cubes algorithm for surface re-construction, will also be added as they are important tools in the work done by our commercial partners.\n\nWithin this project, spatial analysis tailored to different use case scenarios is done on demand and fast enough to be used by modern risk management systems to, for example, determine trajectory escape routes. In addition, it will provide the means to identify and quantify deviations on flow patterns, such as wind and water, while modeling under- and over- ground surfaces. In other words, it addresses the challenges identified by three major companies in the sector: Fugro, Geodan, and Deltares.\n\nFurthermore, this project stands on the shoulders of a successful COMMIT/ project, “spatiotemporal data warehouses for trajectory exploitation” (P19), and the strategic partnership between CWI Database group, Netherlands eScience Center (NLeSC), TU Delft 3D Geo-information group, VU Geographic Information Systems (GIS) group and Geodan to develop core technology for “Big Data Analytics in the Geo-Spatial Domain”.',
  'grantId': 'FIXME',
  'isPublished': true,
  'related': {
    'organizations': [
      {
        'foreignKey': {
          'id': '5cff819c-81c0-473c-9ee0-d0d663b9a9d1',
          'collection': 'organization'
        }
      },
      {
        'foreignKey': {
          'id': 'cwi',
          'collection': 'organization'
        }
      },
      {
        'foreignKey': {
          'id': 'geodan',
          'collection': 'organization'
        }
      },
      {
        'foreignKey': {
          'id': '6eec5d10-4a45-4065-8d21-9415044b1c00',
          'collection': 'organization'
        }
      },
      {
        'foreignKey': {
          'id': 'commit',
          'collection': 'organization'
        }
      },
      {
        'foreignKey': {
          'id': 'deltares',
          'collection': 'organization'
        }
      }
    ],
    'projects': [
      {
        'foreignKey': {
          'collection': 'project',
          'id': '505'
        }
      },
      {
        'foreignKey': {
          'collection': 'project',
          'id': '529'
        }
      },
      {
        'foreignKey': {
          'collection': 'project',
          'id': '1318'
        }
      },
      {
        'foreignKey': {
          'collection': 'project',
          'id': '1349'
        }
      }
    ],
    'software': [
      {
        'foreignKey': {
          'id': 'kernel_tuner',
          'collection': 'software'
        }
      }
    ]
  },
  'team': [
    {
      'foreignKey': {
        'id': 'j.maassen',
        'collection': 'person'
      },
      'isContactPerson': true,
      'role': 'Technical Lead',
      'affiliations': [
        {
          'foreignKey': {
            'id': 'nlesc',
            'collection': 'organization'
          }
        }
      ]
    },
    {
      'affiliations': [],
      'foreignKey': {
        'id': 'w.vanhage',
        'collection': 'person'
      },
      'isContactPerson': false,
      'role': 'Technical Lead'
    }
  ],
  'topics': [
    'Ecology'
  ],
  'technologies': [
    'GPU'
  ],
  'imageCaption': 'Image: Pixabay',
  'slug': '3d-geospatial-data-explor-for-modern-risk-management-systems'
}

export type ProjectItem = typeof project
