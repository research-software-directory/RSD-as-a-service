import logger from './logger'

export function getPropsFromObject(data:any, props: string[],useNull:boolean=true) {
  let newData:any = {}
  props.forEach((prop:any) => {
    if (data.hasOwnProperty(prop)) {
      if (useNull && data[prop] === '') {
        debugger
        newData[prop] = null
      } else {
        newData[prop] = data[prop]
      }
    } else {
      logger(`Property [${prop}] not present in data object`,'warn')
    }
  })
  return newData
}
