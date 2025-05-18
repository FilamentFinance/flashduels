/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'flashduel-images.s3.us-east-1.amazonaws.com',  // Add your S3 bucket domain
      'pbs.twimg.com',  // Twitter profile images domain
      'api.twitter.com'  // Twitter profile images domain
    ],
  },
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
  webpack: (config, context) => {
    if (config.plugins) {
      config.plugins.push(
        new context.webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
        }),
      );
    }
    return config;
  },
};

module.exports = nextConfig;
