import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'kraftbase-stock-derby.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'stock-derby-stage.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
    domains: [
      'kraftbase-stock-derby.s3.ap-south-1.amazonaws.com',
      'res.cloudinary.com',
      'stock-derby-stage.s3.ap-south-1.amazonaws.com'
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/game/platform',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  }
};



export default withNextIntl(nextConfig);

