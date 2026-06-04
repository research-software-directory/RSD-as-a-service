// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

type FilterScreenReaderMsgProps={
  name: string,
  selected: string[],
  optionCnt: number
}

export function screenReaderFilterMsg({name,selected=[],optionCnt=0}:FilterScreenReaderMsgProps){

  if (!name) return ''

  if (selected?.length===0){
    return `${name}: No options selected. ${optionCnt} options available.`
  }

  return `${name}: ${selected.length} of ${optionCnt} options selected. Selected options: ${selected.join(', ')}. Use Backspace to remove last selected option.`
}

export function ariaOptionLabel({name,count}:{name?:string,count?:number}){
  if (name && count){
    return `${name}, ${count} matches available`
  }

  if (name){
    return `${name}, ${count} matches available`
  }

  if (count){
    return `${count} matches available`
  }

  return ''
}
