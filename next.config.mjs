import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const gameType = process.env.NEXT_PUBLIC_GAME_TYPE || 'derby';

const isDerby = gameType === 'derby';

const redirects = [
  {
    source: '/admin',
    destination: '/dashboard',
    permanent: true,
  },
  {
    source: '/',
    destination: isDerby ? "/game" : "game/lobby/select",
    permanent: true,
  }
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

