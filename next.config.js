const { version } = require('./package.json');

const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false
  },
  env: {
    version
  }
};

module.exports = nextConfig;
