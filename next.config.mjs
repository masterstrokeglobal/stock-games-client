
const nextConfig = {
  /* config options here */
  images: {
    domains: [
      'kraftbase-stock-derby.s3.ap-south-1.amazonaws.com'
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/game',
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

export default nextConfig;
