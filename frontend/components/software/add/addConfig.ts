
export const addConfig = {
  title:'Add software',
  addInfo: `
  Please provide name and short description for your software.
  `,
  brand_name: {
    label: 'Name',
    help: 'Provide software name to use as a title of your software page.',
    validation: {
      required: 'Name is required',
      minLength: {value: 3, message: 'Minimum length is 3'},
      maxLength: {value: 100, message: 'Maximum length is 100'},
    }
  },
  short_statement: {
    label: 'Short description',
    help: 'Provide short description of your software to use as page subtitle.',
    validation: {
      required: 'Name is required',
      minLength: {value: 10, message: 'Minimum length is 10'},
      maxLength: {value: 300, message: 'Maximum length is 300'},
    }
  },
  slug: {
    label: 'The url of this software will be',
    help: 'You can change slug. Use letters, numbers and dash "-". Other characters are not allowed.',
    validation: {
      minLength: {value: 3, message: 'Minimum length is 3'}
    }
  }
}

