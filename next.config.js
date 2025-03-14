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
