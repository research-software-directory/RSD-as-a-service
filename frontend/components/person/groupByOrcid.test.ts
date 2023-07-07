// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {addValueToObjectArray} from './groupByOrcid'

describe('AddValueToObjectArray', () => {
  it('add string value from source into a target array', () => {
    const target = {
      trgProp:[]
    }
    const source={
      srcProp:'Source value'
    }

    const newTarget = addValueToObjectArray({
      target,
      targetKey: 'trgProp',
      source,
      sourceKey: 'srcProp'
    })

    expect(newTarget).toEqual({
      trgProp:['Source value']
    })
  })

  it('add array value from source into a target array', () => {
    const target = {
      trgProp: ['Target value']
    }
    const source = {
      srcProp: ['Source value 1',' Source value 2']
    }

    const newTarget = addValueToObjectArray({
      target,
      targetKey: 'trgProp',
      source,
      sourceKey: 'srcProp'
    })

    expect(newTarget).toEqual({
      trgProp: [
        'Target value',
        ...source.srcProp
      ]
    })
  })

  it('skips null value from source into a target array', () => {
    const target = {
      trgProp: ['Target value']
    }
    const source = {
      srcProp: null
    }

    const newTarget = addValueToObjectArray({
      target,
      targetKey: 'trgProp',
      source,
      sourceKey: 'srcProp'
    })

    expect(newTarget).toEqual({
      trgProp: ['Target value']
    })

  })

  it('skips undefined prop from source into a target array', () => {
    const target = {
      trgProp: ['Target value']
    }
    const source = {
      srcProp: undefined
    }

    const newTarget = addValueToObjectArray({
      target,
      targetKey: 'trgProp',
      source,
      sourceKey: 'srcProp'
    })

    expect(newTarget).toEqual({
      trgProp: ['Target value']
    })

  })

  it('skips values already in the target array', () => {
    const target = {
      trgProp: ['Target value', 'Source value 1']
    }
    const source = {
      srcProp: ['Source value 1', ' Source value 2']
    }

    const newTarget = addValueToObjectArray({
      target,
      targetKey: 'trgProp',
      source,
      sourceKey: 'srcProp'
    })

    expect(newTarget).toEqual({
      trgProp: [
        'Target value',
        ...source.srcProp
      ]
    })
  })
})
