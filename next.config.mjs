
const nextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
