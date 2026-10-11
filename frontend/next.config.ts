import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
  async redirects() {
    return [
      // The starter template served posts from /posts — keep old links working
      {source: '/posts/:slug', destination: '/journal/:slug', permanent: true},
      {source: '/home', destination: '/', permanent: true},
    ]
  },
}

export default nextConfig
