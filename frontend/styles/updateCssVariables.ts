
export type CssVariableProps = {
  [key:string]:string | number
}

export function updateCssVariables(vars: CssVariableProps) {
  if (typeof document !== 'undefined') {
    var root:any = document.querySelector(':root')
    if (root) {
      const styles = getComputedStyle(root)
      // const primary = styles.getPropertyValue('--rsd-primary')
      const options = Object.keys(vars)
      options.forEach(key => {
        const item = vars[key]
        // debugger
        // console.log(`--rsd-${key}`, item)
        root.style.setProperty(`--rsd-${key}`, item)
      })
    }
  }
}
