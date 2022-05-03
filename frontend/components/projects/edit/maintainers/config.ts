
export const maintainers = {
  findMaintainer: {
    title: 'Add maintainer',
    subtitle: 'We search by name',
    label: 'Find RSD maintainer',
    help: 'At least 1 letter of first name',
    validation: {
      // custom validation rule, not in use by react-hook-form
      minLength: 1,
    }
  }
}
