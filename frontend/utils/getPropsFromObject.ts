import logger from './logger'

export function getPropsFromObject(data:any, props: string[]) {
  let newData:any = {}
  props.forEach((prop:any) => {
    if (data.hasOwnProperty(prop)) {
      newData[prop] = data[prop]
    } else {
      logger(`Property [${prop}] not present in data object`,'warn')
    }
  })
  return newData
}
