
import logger from './logger'

global.console = {
  error:jest.fn(),
  warn:jest.fn(),
  log:jest.fn()
}

describe("Logger",()=>{
  it("Logs error to console.error",()=>{
    const message="This is my error message"
    logger(message,"error")
    expect(console.error).toBeCalledWith(`[ERROR] ${message}`)
  })
  it("Logs warning to console.warn",()=>{
    const message="This is my warning message"
    logger(message,"warn")
    expect(console.warn).toBeCalledWith(`[WARNING] ${message}`)
  })
  it("Ignores console.log in production mode",()=>{
    process.env.NEXT_PUBLIC_ENV = "production"
    const message="This is my log message"
    logger(message,"info")
    expect(console.log).not.toBeCalledWith(message)
  })
  it("Logs to console.log in dev mode",()=>{
    // console.log(process.env.NEXT_PUBLIC_ENV)
    process.env.NEXT_PUBLIC_ENV = "dev"
    // console.log(process.env.NEXT_PUBLIC_ENV)
    const message="This is my log message"
    logger(message,"info")
    expect(console.log).toBeCalledWith(`[INFO] ${message}`)
  })

})

