// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {sortOnStrProp, sortOnDateProp, sortOnNumProp, sortBySearchFor} from './sortFn'

const toOrder=[
  {id:1,name:'K',amount:100},
  {id:1,name:'Z',amount:100},
  {id:1,name:'b',amount:100},
  {id:1,name:'a',amount:100},
  {id:1,name:'N',amount:100},
  {id:1,name:'T',amount:100},
]

const orderAsc=[
  {id:1,name:'a',amount:100, datum: '2020-12-1'},
  {id:1,name:'b',amount:99, datum: '2019-12-1'},
  {id:1,name:'c',amount:98, datum: '2019-12-26'},
  {id:1,name:'d',amount:96.5, datum: '2020-12-15'},
  {id:1,name:'e',amount:94, datum: '2020-12-7'},
  {id:1,name:'f',amount:89, datum: '2018-11-1'},
]

const orderSearchFor = [
  {id: 1, name: 'abcd', amount: 100, datum: '2020-12-1'},
  {id: 1, name: 'bcde', amount: 99, datum: '2019-12-1'},
  {id: 1, name: 'cdef', amount: 98, datum: '2019-12-26'},
  {id: 1, name: 'defg', amount: 96.5, datum: '2020-12-15'},
  {id: 1, name: 'efgh', amount: 94, datum: '2020-12-7'},
  {id: 1, name: 'fghi', amount: 89, datum: '2018-11-1'},
  {id: 1, name: 'cd', amount: 98, datum: '2019-12-26'},
]

describe('sortFn',()=>{
  it('order asc on prop name',()=>{
    const resp = toOrder.sort((a,b)=>sortOnStrProp(a,b,'name'))
    const first = resp[0]
    const last = resp[resp.length-1]
    expect(first.name).toEqual('a')
    expect(last.name).toEqual('Z')
  })
  it('order desc on prop name',()=>{
    const resp = toOrder.sort((a,b)=>sortOnStrProp(a,b,'name','desc'))
    const first = resp[0]
    const last = resp[resp.length-1]
    expect(first.name).toEqual('Z')
    expect(last.name).toEqual('a')
  })
  it('order asc op amount',()=>{
    const resp = orderAsc.sort((a,b)=>sortOnNumProp(a,b,'amount'))
    const first = resp[0]
    const last = resp[resp.length-1]
    expect(first.amount).toEqual(89)
    expect(last.amount).toEqual(100)
  })
  it('order asc op date',()=>{
    const resp = orderAsc.sort((a,b)=>sortOnDateProp(a,b,'datum'))
    const first = resp[0]
    const last = resp[resp.length-1]
    expect(first.datum).toEqual('2018-11-1')
    expect(last.datum).toEqual('2020-12-15')
  })

  it('order desc op date',()=>{
    const resp = orderAsc.sort((a,b)=>sortOnDateProp(a,b,'datum','desc'))
    const first = resp[0]
    const last = resp[resp.length-1]
    expect(first.datum).toEqual('2020-12-15')
    expect(last.datum).toEqual('2018-11-1')
  })

  it('order by searchFor', () => {
    const resp = orderSearchFor.sort((a, b) => sortBySearchFor(a, b, 'name', 'cd'))
    const first = resp[0]
    const second = resp[1]
    const third = resp[2]
    const fourth = resp[3]

    // first exact match
    expect(first.name).toEqual('cd')
    // second starts with
    expect(second.name).toEqual('cdef')
    // third contains it closer to left then fourth
    expect(third.name).toEqual('bcde')
    // fourth contains it further to left then third
    expect(fourth.name).toEqual('abcd')
  })

})

