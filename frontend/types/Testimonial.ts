// Based on record from testimonial table
// 003-create-relations-for-software.sql
const testimonial = {
  'id': '5969556c-55ac-4912-812a-1be0f9c5d759',
  'software': '87d793ed-9aff-4f87-aa07-586ca42b9e2a',
  'affiliation': 'Professor of Private Law, Maastricht University',
  'person': 'Gijs van Dijck',
  'text': 'It’s quite amazing to see how, thanks to this tool, a student can, in some ways, outperform the expert.'
}

export type NewTestimonial = {
  software: string,
  affiliation: string,
  person: string,
  text: string
}

export type Testimonial = NewTestimonial & {
  id:string
}
