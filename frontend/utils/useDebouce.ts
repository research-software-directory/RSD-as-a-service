import {useState,useEffect} from 'react'

export function useDebounce(value:string, delay:number) {
  // state debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // clear timeout on value changes or unmount
      return () => {
        clearTimeout(handler)
      }
    },[value, delay])
  return debouncedValue
}
