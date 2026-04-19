import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const environment = config.env.environment || 'local';
      const urls: Record<string, string> = {
        local: 'http://localhost:9002',
        dev: 'https://rainsingatlantic-web-dev.vercel.app',
        staging: 'https://rainsingatlantic-web-staging.vercel.app',
        prod: 'https://raisingatlantic-web.vercel.app',
      };

      config.baseUrl = urls[environment];
      console.log(`Testing environment: ${environment} - Base URL: ${config.baseUrl}`);

      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },
});
