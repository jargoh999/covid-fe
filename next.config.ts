/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/covid-fe',
  assetPrefix: '/covid-fe/'
}

export default nextConfig
