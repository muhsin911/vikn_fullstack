// craco.config.js
module.exports = {
    devServer: {
      allowedHosts: 'all', // This ensures the allowedHosts setting is configured correctly
    },
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        // Custom Webpack configuration can be added here
        return webpackConfig;
      },
    },
  };
  