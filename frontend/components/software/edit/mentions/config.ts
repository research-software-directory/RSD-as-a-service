
export const cfgImpact = {
  title: 'Mentions',
  findMention: {
    title: 'Find publication',
    subtitle: 'We search in Crossref, DataCite and RSD databases',
    label: 'DOI or publication title',
    help: 'Provide valid DOI or title of the publication',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  newItem: {
    title: 'New item',
    subtitle: 'Use add button to create new item'
  }
}
