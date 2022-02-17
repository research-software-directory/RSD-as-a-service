// Based on record from testimonial table
// 003-create-relations-for-software.sql

export type NewTestimonial = {
  position?: number
  software: string,
  message: string|null,
  source: string|null,
}

export type Testimonial = NewTestimonial & {
  id:string|null
}
