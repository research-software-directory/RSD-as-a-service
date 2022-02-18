// functions and DND implementation
// copied from this example
// https://codesandbox.io/s/draggable-material-ui-oj3wz?file=/src/helpers.ts:87-325

export function reorderList<T>({list,startIndex,endIndex}:
  {list:T[],startIndex:number,endIndex:number}){
  // copy items
  const result = Array.from(list)
  // remove
  const [removed] = result.splice(startIndex, 1)
  // return
  result.splice(endIndex, 0, removed)
  // return results
  return result
}
