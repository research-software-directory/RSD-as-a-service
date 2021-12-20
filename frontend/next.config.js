/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    // Run ESLint in these directories during production builds (next build)
    dirs: ["components","config","pages","styles","types","utils"]
  },
}
