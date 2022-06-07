import {MentionByType, MentionTypeKeys} from '~/types/Mention'

export const mentionModal = {
  sectionTitle: 'Mentions',
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
        value: 500,
        message: 'Maximum length is 500'
      }
    }
  },
  authors: {
    label: 'Author(s)',
    help: 'List all authors',
    validation: {
      required: false,
      maxLength: {
        value: 1000,
        message: 'Maximum length is 1000'
      }
    }
  },
  publisher: {
    label: 'Publisher',
    help: 'Name of publisher, journal, website...',
    validation: {
      required: false
    }
  },
  page: {
    label: 'Page',
    help: 'Page or page range',
    validation: {
      required: false
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
        value: /^https?:\/\/.+\..+/,
        message: 'Url should start with http(s):// have at least one dot (.)'
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
        value: /^https?:\/\/.+\..+/,
        message: 'Url should start with http(s):// have at least one dot (.)'
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
  if (type === null) {
    // default is other type
    item = mentionType['other']
  } else {
    item = mentionType[type]
  }
  if (option) {
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
    singular: 'Interviews',
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
  presentation: {
    key: 'presentation',
    plural: 'Presentations',
    singular: 'Presentation',
    manual: true
  },
  report: {
    key: 'report',
    plural: 'Reports',
    singular: 'Reports',
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
  other: {
    key: 'other',
    plural: 'Other',
    singular: 'Other',
    manual: true
  }
}
