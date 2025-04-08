import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();


const redirects = [
  {
    source: '/admin',
    destination: '/dashboard',
    permanent: true,
  },
];


const nextConfig = {
  /* config options here */
  images: {
    domains: [
      'kraftbase-stock-derby.s3.ap-south-1.amazonaws.com'
    ],
  },
  redirects: async () => {
    return redirects;
  }
};



export default withNextIntl(nextConfig);

