// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {MentionByType, MentionTypeKeys} from '~/types/Mention'
import {DOI_REGEX_STRICT} from '~/components/software/edit/mentions/utils'

export const findMention={
  // title: 'Add publication',
  // subtitle: 'We search in Crossref, DataCite and RSD databases',
  label: 'Search by DOI, OpenAlex ID or publication title',
  help: 'Valid DOI, OpenAlex ID or at least first 2 letters of publication title',
  validation: {
    // custom validation rule, not in use by react-hook-form
    minLength: 2,
  }
}

export const mentionModal = {
  sectionTitle: 'Mentions',
  doi: {
    label: 'DOI',
    help: undefined,
    validation: {
      required: false,
      maxLength: {
        value: 255,
        message: 'Maximum length is 255'
      },
      pattern: {
        value: DOI_REGEX_STRICT,
        message: 'The DOI should look like 10.XXX/XXX'
      }
    }
  },
  title: {
    label: 'Title *',
    help: 'Publication title is required',
    validation: {
      required: 'Publication title is required',
      minLength: {
        value: 5,
        message: 'Minimum length is 5'
      },
      maxLength: {
        value: 3000,
        message: 'Maximum length is 3000'
      }
    }
  },
  authors: {
    label: 'Author(s)',
    help: 'List all authors',
    validation: {
      required: false,
      maxLength: {
        value: 50000,
        message: 'Maximum length is 50000'
      }
    }
  },
  publisher: {
    label: 'Publisher',
    help: 'Name of publisher',
    validation: {
      required: false,
      maxLength: {
        value: 255,
        message: 'Maximum length is 255'
      }
    }
  },
  journal: {
    label: 'Journal',
    help: 'Name of journal, book series, website...',
    validation: {
      required: false,
      maxLength: {
        value: 500,
        message: 'Maximum length is 500'
      }
    }
  },
  page: {
    label: 'Page',
    help: 'Page or page range',
    validation: {
      required: false,
      maxLength: {
        value: 50,
        message: 'Maximum length is 50'
      }
    }
  },
  mentionType: {
    label: 'Type *',
    help: 'Publication type is required',
    validation: {
      required: 'Publication type is required'
    }
  },
  publication_year: {
    label: 'Publication year',
    help: 'The year of publication',
    validation: {
      required: false,
    }
  },
  url: {
    label: 'Url *',
    help: 'Url to publication webpage is required',
    validation: {
      required: 'Url is required',
      maxLength: {
        value: 500,
        message: 'Maximum length is 500'
      },
      pattern: {
        value: /^https?:\/\/\S+$/,
        message: 'Url must start with http(s):// and cannot contain white spaces'
      }
    }
  },
  note: {
    label: 'Note',
    help: 'Add a custom note',
    validation: {
      required: false,
      maxLength: {
        value: 500,
        message: 'Maximum length is 500'
      }
    }
  },
  openalex_id: {
    label: 'OpenAlex ID',
    help: 'The OpenAlex ID',
    validation: {
      required: false,
      pattern: {
        value: /^https:\/\/openalex\.org\/[WwAaSsIiCcPpFf]\d{3,13}$/,
        message: 'e.g. https://openalex.org/W3160330321'
      }
    }
  },
  image_url: {
    label: 'Image url*',
    help: 'Url to publication image is required for highlighted mention',
    validation: {
      required: 'Image url is required for highlighted mention',
      maxLength: {
        value: 500,
        message: 'Maximum length is 500'
      },
      pattern: {
        value: /^https?:\/\/\S+$/,
        message: 'Url must start with http(s):// and cannot contain white spaces'
      }
    }
  },
  is_featured: {
    label: 'Featured',
    validation: {
      required: false
    }
  }
}

export function getMentionType(type: MentionTypeKeys | null, option: 'plural' | 'singular') {
  let item
  if (type === null || typeof type == 'undefined') {
    // default is other type
    item = mentionType['other']
  } else {
    item = mentionType[type]
  }
  if (option) {
    // console.log('getMentionType...option...',option)
    // debugger
    return item[option]
  }
  // default is singular
  return item.singular
}

export function getMentionTypeOrder(mentionByType: MentionByType) {
  const allTypesInObjectOrder = Object.keys(mentionType)
  const mentionTypes = Object.keys(mentionByType)
  const orderedTypes: MentionTypeKeys[] = []
  allTypesInObjectOrder.forEach(key => {
    if (mentionTypes.includes(key) === true) {
      orderedTypes.push(key as MentionTypeKeys)
    }
  })
  return orderedTypes
}


/**
 * Based on database enum type from
 * database/008-create-mention-table.sql
 */
export const mentionType = {
  blogPost: {
    key: 'blogPost',
    plural: 'Blogposts',
    singular: 'Blogpost',
    manual: true
  },
  book: {
    key: 'book',
    plural: 'Books',
    singular: 'Book',
    manual: true
  },
  bookSection: {
    key: 'bookSection',
    plural: 'Book section',
    singular: 'Book section',
    manual: true
  },
  computerProgram: {
    key: 'computerProgram',
    plural: 'Computer programs',
    singular: 'Computer program',
    manual: true
  },
  conferencePaper: {
    key: 'conferencePaper',
    plural: 'Conference papers',
    singular: 'Conference paper',
    manual: true
  },
  dataset: {
    key: 'dataset',
    plural: 'Dataset',
    singular: 'Dataset',
    manual: true
  },
  highlight: {
    key: 'highlight',
    plural: 'Highlights',
    singular: 'Highlight',
    manual: true
  },
  interview: {
    key: 'interview',
    plural: 'Interviews',
    singular: 'Interview',
    manual: true
  },
  journalArticle: {
    key: 'journalArticle',
    plural: 'Journal articles',
    singular: 'Journal article',
    manual: true
  },
  magazineArticle: {
    key: 'magazineArticle',
    plural: 'Magazine articles',
    singular: 'Magazine article',
    manual: true
  },
  newspaperArticle: {
    key: 'newspaperArticle',
    plural: 'Newspaper articles',
    singular: 'Newspaper article',
    manual: true
  },
  poster: {
    key: 'poster',
    plural: 'Posters',
    singular: 'Poster',
    manual: true
  },
  presentation: {
    key: 'presentation',
    plural: 'Presentations',
    singular: 'Presentation',
    manual: true
  },
  report: {
    key: 'report',
    plural: 'Reports',
    singular: 'Report',
    manual: true
  },
  thesis: {
    key: 'thesis',
    plural: 'Thesis',
    singular: 'Thesis',
    manual: true
  },
  videoRecording: {
    key: 'videoRecording',
    plural: 'Video recordings',
    singular: 'Video recording',
    manual: true
  },
  webpage: {
    key: 'webpage',
    plural: 'Webpages',
    singular: 'Webpage',
    manual: true
  },
  workshop: {
    key: 'workshop',
    plural: 'Workshops',
    singular: 'Workshop',
    manual: true
  },
  other: {
    key: 'other',
    plural: 'Other',
    singular: 'Other',
    manual: true
  }
}
