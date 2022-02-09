
import {getPropsFromObject} from './getPropsFromObject'

it('returns required props', () => {
  const testObject = {
    prop1: 'prop1',
    prop2: 'prop2',
    prop3: 'prop3'
  }
  const resp = getPropsFromObject(testObject, ['prop1', 'prop3'])
  expect(resp).toEqual({
    prop1: 'prop1',
    prop3: 'prop3',
  })
})
