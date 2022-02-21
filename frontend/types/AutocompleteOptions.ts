export type AutocompleteOption<T> = {
  key: string
  label: string
  data: T
}


export type AutocompleteOptionWithLink<T> = {
  key: string
  label: string,
  link: string,
  data: T
}
