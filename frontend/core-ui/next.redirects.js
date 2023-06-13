
let redirectsConfig = []

if (process.env.NODE_ENV === 'production') {
  // in production we redirect root to /home
  redirectsConfig = [
    {
      source: '/',
      destination: 'http://localhost/home',
      permanent: true,
    },
  ]
} else {
  // no redirects in de
  redirectsConfig=[]
}

module.exports = redirectsConfig