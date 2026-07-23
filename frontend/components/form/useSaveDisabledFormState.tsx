// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// constrain errors object to react-hook-form type
export type CustomFormState = Readonly<{
  isValidating?: boolean;
  isValid?: boolean;
  isDirty?: boolean;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}>

export function useSaveDisabledFormState({
  isValidating,isDirty,isSubmitting,isSubmitted,isValid
}:CustomFormState){
  // console.groupCollapsed('useSaveDisabledFormState')

  if (isValidating) {
    // console.log('isValidating...',isValidating)
    // console.groupEnd()
    return true
  }
  // nothing is changes so nothing to save
  if (!isDirty){
    // console.log('isValidating...',isValidating)
    // console.log('isDirty...',isDirty)
    // console.groupEnd()
    return true
  }
  // currently submitting form (so no second instance allowed)
  if (isSubmitting){
    // console.log('isValidating...',isValidating)
    // console.log('isDirty...',isDirty)
    // console.log('isSubmitting...',isSubmitting)
    // console.groupEnd()
    return true
  }
  // the values are already submitted (no second instance allowed)
  if (isSubmitted){
    // console.log('isValidating...',isValidating)
    // console.log('isDirty...',isDirty)
    // console.log('isSubmitting...',isSubmitting)
    // console.log('isSubmitted...',isSubmitted)
    // console.groupEnd()
    return true
  }
  // the form is not valid (there are errors)
  if (!isValid){
    // console.log('isValidating...',isValidating)
    // console.log('isDirty...',isDirty)
    // console.log('isSubmitting...',isSubmitting)
    // console.log('isSubmitted...',isSubmitted)
    // console.log('isValid...',isValid)
    // console.groupEnd()
    return true
  }
  // console.log('isValidating...',isValidating)
  // console.log('isDirty...',isDirty)
  // console.log('isSubmitting...',isSubmitting)
  // console.log('isSubmitted...',isSubmitted)
  // console.log('isValid...',isValid)
  // console.log('passed ALL...returning FALSE')
  // console.groupEnd()
  // debugger
  // if all met then save button can be enabled
  return false
}
