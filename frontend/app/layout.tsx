import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'; // or `v14-appRouter` if you are using Next.js v14

// global CSS and tailwind
import '../styles/global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Research Software Directory</title>
        {/* Theme color for the browser, if it supports it, is REMOVED 2022-04-10 by Dusan */}
        {/* <meta name="theme-color" content={rsdMuiTheme.palette.primary.main} /> */}
        {/* PWA manifest.json for favicons */}
        <link rel="manifest" href="/manifest.json" />
        {/* mounted index.css with font definitions */}
        {/*eslint-disable-next-line @next/next/no-css-tags*/}
        <link href="/styles/index.css" rel="stylesheet" />
      </head>
      <body className="dark">
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        {children}
      </AppRouterCacheProvider>
      </body>
      {/* <body>{children}</body> */}
    </html>
  )
}