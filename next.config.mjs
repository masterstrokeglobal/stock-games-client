
const nextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/game',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
