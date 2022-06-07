
export const cfgImpact = {
  title: 'Impact',
  findMention: {
    title: 'Find publication',
    subtitle: 'We search in Crossref, DataCite and RSD databases',
    label: 'DOI or publication title',
    help: 'Provide a valid DOI or the title of the publication',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 2,
    }
  },
  newItem: {
    title: 'New item without DOI',
    subtitle: 'Use add button to create new item without DOI'
  }
}
