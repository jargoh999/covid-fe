/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  async rewrites() {
    return [
      {
        source: '/predict',
        destination: 'http://51.20.84.12:8000/predict'
      }
    ]
  }
}

module.exports = nextConfig
