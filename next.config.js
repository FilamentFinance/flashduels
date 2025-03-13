/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return process.env.NEXT_PUBLIC_PRODUCTION === 'production'
      ? [] // No additional headers in production
      : [
          {
            source: '/:path*',
            headers: [
              {
                key: 'X-Robots-Tag',
                value: 'noindex',
              },
            ],
          },
        ];
  },
};

module.exports = nextConfig;
